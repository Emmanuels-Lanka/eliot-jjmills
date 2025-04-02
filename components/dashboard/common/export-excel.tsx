import * as XLSX from "xlsx";

const exportToExcel = (data: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data, {
    header: [
      "Day Target", "8 to 9", "9 to 10", "10 to 11", "11 to 12", 
      "12 to 13", "13 to 14", "14 to 15", "15 to 16", 
      "16 to 17", "17 to 18", "Day Production (QC Pass)", 
      "Behind As Per Target", "Day Achieve %",
    ],
  });
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Target vs Achievement");

  // Export the Excel file
  XLSX.writeFile(workbook, "Target_vs_Achievement.xlsx");
};

// Example data structure to match the header
const data = [
  {
    "Day Target": 100,
    "8 to 9": 10,
    "9 to 10": 15,
    "10 to 11": 12,
    "11 to 12": 8,
    "12 to 13": 10,
    "13 to 14": 14,
    "14 to 15": 10,
    "15 to 16": 9,
    "16 to 17": 7,
    "17 to 18": 12,
    "Day Production (QC Pass)": 97,
    "Behind As Per Target": 3,
    "Day Achieve %": "97%",
  },
];

exportToExcel(data);
