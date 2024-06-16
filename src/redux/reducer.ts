import { AppState } from "./app-state";
import { Action } from "./action";
import { ActionType } from "./action-type";

const appStateInitialValue = new AppState();

export function reduce(oldAppState: AppState = appStateInitialValue, action: Action): AppState {
    let newAppState = { ...oldAppState };

    switch (action.type) {
    }
    return newAppState;
}