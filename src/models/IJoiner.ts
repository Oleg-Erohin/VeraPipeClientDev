export interface IJoiner{
    id: number;
    tagId: string;
    certifiedDiameterMinMm: number;
    certifiedDiameterMaxMm: number;
    certifiedDiameterMinInch: number;
    certifiedDiameterMaxInch: number;
    maxDepositedMaterial: number;
    baseMaterialTypeName1: string;
    baseMaterialTypeName2: string;
    jointDesignName: string;
    fusionProcessName: string;
}