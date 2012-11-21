/* -*- Mode: C++; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4 -*-
 * vim: set ts=4 sw=4 et tw=99:
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "ParFunctions.h"
#include "jsinterp.h"
#include "jsinterpinlines.h"
#include "vm/forkjoininlines.h"
#include "jscompartmentinlines.h"

namespace js {
namespace ion {

// Load the current thread context.
ForkJoinSlice *ParForkJoinSlice() {
    return js::ForkJoinSlice::current();
}

// ParNewGCThing() is called in place of NewGCThing() when executing
// parallel code.  It uses the ArenaLists for the current thread and
// allocates from there.
JSObject *
ParNewGCThing(ForkJoinSlice *slice, gc::AllocKind allocKind, uint32_t thingSize) {
    void *t = slice->allocator->parallelNewGCThing(allocKind, thingSize);
    return static_cast<JSObject *>(t);
}

// Check that the object was created by the current thread
// (and hence is writable).
bool ParWriteGuard(ForkJoinSlice *slice, JSObject *object) {
    return slice->allocator->arenas.containsArena(slice->runtime(),
                                                  object->arenaHeader());
}

// This isn't really the right place for this, it's could be a more
// general facility.
void ParBailout(uint32_t id) {
    fprintf(stderr, "TRACE: id=%-10u\n", id);
}

bool ParCheckInterrupt(ForkJoinSlice *slice) {
    bool result = slice->check();
    if (!result) {
        fprintf(stderr, "Check Interrupt failed!\n");
    }
    return result;
}

}
}
