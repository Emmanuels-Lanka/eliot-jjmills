type productionLineTypes = {
    id: string;
    name: string;
    sewingMachineId: string | null;
    unitId: string;
    createdAt: Date;
    updatedAt: Date;
}

type ObbOperationData = {
    id: string;
    seqNo: number;
    operationId: string;
    obbSheetId: string;
    smv: number;
    target: number;
    spi: number;
    length: number;
    totalStitches: number;
    createdAt: Date;
    updatedAt: Date;
    part: string | null;
    operation: {
        id: string;
        name: string;
        code: string | null;
    };
    sewingMachine?: {
        id: string;
        brandName: string;
        machineType: string;
        machineId: string;
    } | null;
    supervisor?: {
        id: string;
        name: string;
        employeeId: string;
    } | null;
    supervisorId: string | null;
};

type SendEmailAlertResponseProps = {
    status: number;
    message: string;
}

type MachineDataWithObbOperation = {
    obbOperation: {
        id: string;
        target: number;
    } | null;
}

type ProductionBoardDataType = {
  id: string;
  operatorRfid: string;
  eliotSerialNumber: string;
  obbOperationId: string;
  productionCount: number;
  timestamp: string;
  createdAt: string;
  obbOperation: {
    totalSMV: any;
    id: string;
    seqNo: number;
    target: number;
    operation: {
      name: string;
    };
    obbSheet: {
      id: string;
      name: string;
      buyer: string;
      style: string;
      totalSMV: string;
        target100: number;
    };
  };
};
type ProductionDataForChartTypes = {
    id: string;
    operatorRfid: string;
    eliotSerialNumber: string;
    obbOperationId: string;
    productionCount: number;
    timestamp: string;
    createdAt: Date;
    operator: {
        name: string;
        employeeId: string;
        rfid: string;
    };
   
    obbOperation: {
        id: string;
        seqNo: number;
        target: number;
        smv: number;
        part:string;
        operation: {
            name: string;
        };
        sewingMachine: {
            
                machineId:string
            
        }
        
    };
    data: {

    }
   
};

type OperationEfficiencyOutputTypes = {
    data: {
        hourGroup: string,
        operation: {
            part?: any;
            name: string,
            efficiency: number | null
        }[];
    }[];
    categories: string[];
    machines?: string[];
    eliot?:string[];
    part?: string[];
    
};

type OperatorEfficiencyOutputTypes = {
    data: {
        hourGroup: string,
        operator: {
            name: string,
            efficiency: number | null
        }[];
    }[];
    categories: string[];
};

type ProductionSMVDataTypes = {
    id: number;
    obbOperationId: string;
    operatorRfid: string;
    obbOperation: {
        smv: string;
        operation: {
            name: string;
            code: string;
        }
    }
    smv: string;
    timestamp: string;
}

type DHUDefectsDataTypes = {
    id: string;
    qcStatus: string;
    itemId: string;
    timestamp: string;
    obbOperationId: string;
    operatorId: string;
    operatorName: string;
    defects: string[];
}[];

type DataTypesForRoamingQC = {
    style: string;
    buyerName: string;
    obbOperationId: string;
    operationName: string;
    operationCode?: string;
    operatorName: string;
    operatorRfid: string;
}

type RoamingQcDataTypes = {
    id: string;
    machineId: string;
    unit: string | null;
    lineId: string;
    obbOperationId: string;
    operatorRfid: string;
    timestamp: string;
    colorStatus: string;
    inspectedQty: string;
    createdAt: Date;
    defects: String[];
    operator: {
        name: string;
        employeeId: string;
        rfid: string;
    };
    obbOperation: {
        id: string;
        seqNo: number;
        operation: {
            name: string;
            code: string;
        };
    };
    sewingMachine: {
        id: string;
        brandName: string;
        machineType: string;
        machineId: string;
    }
};

type RoamingQcChartFunctionOutputTypes = {
    data: {
        hourGroup: string,
        operation: {
            name: string,
            color: string,
        }[];
    }[];
    categories: string[];
};

type ReportObbDetailsTypes = {
    id: string;
    style: string;
    version: string;
    line: string;
    unit: string;
    indEngineer: string | null;
    mechanic: string | null;
    qualityIns: string | null;
    accInputMan: string | null;
    fabInputMan: string | null;
    lineChief: string | null;
    buyer: string;
    item: string;
    colour: string | null;
    startingDate: string;
    endingDate: string;
    factoryStartTime: string | null;
    factoryStopTime: string | null;
    workingHours: number | null;
    totalSMV: number | null;
    obbOperationsNo: number | null;
    bundleTime: string | null;
    personalAllowance: string | null;
    efficiencyLevel1: number;
    efficiencyLevel3: number;
    operations: {
        id: string;
        seqNo: number;
        smv: number;
        target: number;
        part: string | null;
        operationName: string;
        operationCode: string | null;
        machineId?: string;
    }[];
}