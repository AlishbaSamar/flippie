"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "flippie-cart";
const listeners = new Set<() => void>();

const EMPTY: string[] = [];

let itemIds: string[] = EMPTY;
let hydrated = false;

function loadFromStorage(): string[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(itemIds));
  } catch {
    // ignore unavailable storage
  }
}

function setItemIds(next: string[]) {
  itemIds = next;
  persist();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): string[] {
  if (!hydrated) {
    itemIds = loadFromStorage();
    hydrated = true;
  }
  return itemIds;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

export function addItem(id: string) {
  if (!itemIds.includes(id)) setItemIds([...itemIds, id]);
}

export function removeItem(id: string) {
  setItemIds(itemIds.filter((existing) => existing !== id));
}

export function clearCart() {
  setItemIds([]);
}

export function useCart() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const has = useCallback((id: string) => ids.includes(id), [ids]);
  return { itemIds: ids, addItem, removeItem, clear: clearCart, has };
}
