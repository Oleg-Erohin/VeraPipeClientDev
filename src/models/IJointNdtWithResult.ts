import { IJoint } from "./IJoint";
import { INdtReport } from "./INdtReport";

export interface IJointNdtWithResult {
    id: number;
    // joint: IJoint;
    ndtReport: INdtReport;
    isPassed: Boolean;
}