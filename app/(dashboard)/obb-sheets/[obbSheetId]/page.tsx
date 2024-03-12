import { ObbOperation, ObbSheet, Operation, SewingMachine, Staff } from "@prisma/client";

import AddObbOperationForm from "@/components/dashboard/forms/add-obb-operation-form";
import CreateObbSheetForm from "@/components/dashboard/forms/create-obb-sheet-form";
import { db } from "@/lib/db";

interface CategorizedStaff {
  [key: string]: Staff[];
}

const ObbSheetId = async ({
  params
}: {
  params: { obbSheetId: string }
}) => {
  const units = await db.unit.findMany({
    select: {
      name: true,
      id: true,
    }
  });

  const staffs: Staff[] | null = await db.staff.findMany();

  const categorizedStaff: CategorizedStaff = staffs.reduce((acc: CategorizedStaff, staff: Staff) => {
    const { designation } = staff;
    if (!acc[designation]) {
      acc[designation] = [];
    }
    acc[designation].push(staff);
    return acc;
  }, {});

  const sheets: ObbSheet | null = await db.obbSheet.findUnique({
    where: {
      id: params.obbSheetId
    }
  });

  const obbOperations: ObbOperation[] | null = await db.obbOperation.findMany({
    where: {
      obbSheetId: params.obbSheetId
    }
  });

  const operations: Operation[] | null = await db.operation.findMany();

  const machines: SewingMachine[] | null = await db.sewingMachine.findMany({
    where: {
      isAssigned: true,
    }
  });

  return (
    <section className="mt-16 mx-auto max-w-7xl space-y-12">
      <AddObbOperationForm 
        operations={operations}
        machines={machines}
        obbOperations={obbOperations}
        obbSheetId={params.obbSheetId}
      />
      <div className="space-y-4">
        <div>
          <h2 className="text-slate-800 text-xl font-medium">Update OBB Sheet</h2>
          <p className="text-slate-500 text-sm">You can update the OBB sheet which you created!</p>
        </div>
        <CreateObbSheetForm 
          units={units} 
          mechanics={categorizedStaff?.["mechanics"]}
          supervisor={categorizedStaff?.["supervisor"]}
          qualityInspector={categorizedStaff?.["quality-inspector"]}
          industrialEngineer={categorizedStaff?.["industrial-engineer"]}
          accessoriesInputMan={categorizedStaff?.["accessories-input-man"]}
          fabricInputMan={categorizedStaff?.["fabric-input-man"]} 
          initialData={sheets}
          obbSheetId={params.obbSheetId}
        />
      </div>
    </section>
  )
}

export default ObbSheetId