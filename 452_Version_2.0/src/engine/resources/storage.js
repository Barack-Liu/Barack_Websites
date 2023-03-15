/*
 * File: xml.js
 *
 * logics for loading an xml file into the resource_map
 */
"use strict";

import * as map from "../core/resource_map.js";
// functions from resource_map
let has = map.has;
let get = map.get;

function allocate(key) {
    if (!has(key))
        map.loadRequested(key);
}

function set(key, value) {
    if (!has(key)) 
        allocate(key);
    map.set(key, value);
}

export {has, get, set}