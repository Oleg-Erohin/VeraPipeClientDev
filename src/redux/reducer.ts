import { AppState } from "./app-state";
import { Action } from "./action";
import { ActionType } from "./action-type";

const appStateInitialValue = new AppState();

export function reduce(oldAppState: AppState = appStateInitialValue, action: Action): AppState {
    let newAppState = { ...oldAppState };

    switch (action.type) {
        // case ActionType.EditBaseMaterialCertificate:
        //     newAppState.editedBaseMaterialCertificate = action.payload.editedBaseMaterialCertificate;
        //     break;
        case ActionType.UpdateBaseMaterialCertificates:
            newAppState.baseMaterialCertificates = action.payload.baseMaterialCertificates
    }
    return newAppState;
}