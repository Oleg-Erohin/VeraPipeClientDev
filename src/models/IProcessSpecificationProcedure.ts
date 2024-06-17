export interface IProcessSpecificationProcedure {
    id: number;
    name: number;
    jointDesignName: string;
    baseMaterialName1: string;
    baseMaterialName2: string;
    fusionProcessName: string;
    fillerMaterialName1: string;
    fillerMaterialName2: string;
    standardCodeName: string;
    isPreheatRequired: boolean;
    isPostWeldHeatTreatmentRequired: boolean;
    diameterMinMm: number;
    diameterMaxMm: number;
    diameterMinInch: number;
    diameterMaxInch: number;
    unitOfMeasure: UnitOfMeasure;
    thicknessMinMm: number;
    thicknessMaxMm: number;
}