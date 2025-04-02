import { Staff } from "@prisma/client";

import CreateObbSheetForm from "@/components/dashboard/forms/create-obb-sheet-form";
import { db } from "@/lib/db";

interface CategorizedStaff {
  [key: string]: Staff[];
}

const CreateNewObbSheet = async () => {
  const units = await db.unit.findMany({
    select: {
      name: true,
      id: true,
    }
  });

  const staffs = await db.staff.findMany();

  const categorizedStaff: CategorizedStaff = staffs.reduce((acc: CategorizedStaff, staff: Staff) => {
    const { designation } = staff;
    if (!acc[designation]) {
      acc[designation] = [];
    }
    acc[designation].push(staff);
    return acc;
  }, {});

  // console.log("Line Chief:", categorizedStaff?.["line-chief"]);

  return (
    <CreateObbSheetForm 
      units={units} 
      mechanics={categorizedStaff?.["mechanics"]}
      supervisor={categorizedStaff?.["supervisor"]}
      qualityInspector={categorizedStaff?.["quality-inspector"]}
      industrialEngineer={categorizedStaff?.["industrial-engineer"]}
      accessoriesInputMan={categorizedStaff?.["accessories-input-man"]}
      fabricInputMan={categorizedStaff?.["fabric-input-man"]}
      lineChief={categorizedStaff?.["line-chief"]}
      mode="create" 
    />
  )
}

export default CreateNewObbSheet