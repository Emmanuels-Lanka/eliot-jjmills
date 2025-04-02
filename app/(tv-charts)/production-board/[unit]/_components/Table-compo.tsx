import { MainDataType } from './analytics-chart'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TableCompo = ({data}:{data:MainDataType []}) => {

    console.log("neeew",data)

    // Determine the maximum number of hour groups
    const maxHourGroups = Math.max(...data.map(d => d.hourGroups.length));

    // Calculate total production for each hour group
    const totalProductionPerHour = Array.from({ length: maxHourGroups }).map((_, idx) => 
        data.reduce((acc, d) => acc + (d.hourGroups[idx]?.production ?? 0), 0)
      );
  
    // Calculate total production overall
    const totalProductionOverall = data.reduce((acc, d) => 
        acc + d.hourGroups.reduce((sum, hg) => sum + (hg.production ?? 0), 0), 0
      );

  return (
    <div className="bg-gray-900 text-white p-4 rounded-xl shadow-md">
      <Table className="text-sm min-w-full border-collapse border rounded-lg border-gray-700">
        <TableHeader>
          <TableRow className="h-8 bg-gray-800 rounded-lg"> {/* Reduce row height */}
            <TableHead className="px-2 py-1 border border-gray-700 text-slate-400">Line No</TableHead> {/* Reduce padding */}
            <TableHead className="px-2 py-1 border border-gray-700 text-slate-400">Buyer & Style</TableHead>
            <TableHead className="px-2 py-1 border border-gray-700 text-slate-400">SMV</TableHead>
            <TableHead className="px-2 py-1 border border-gray-700 text-slate-400">Target</TableHead>
            {Array.from({ length: maxHourGroups }).map((_, idx) => (
              <TableHead key={idx} className="px-2 py-1 text-center border border-gray-700 text-slate-400">Hour {8 + idx}.00</TableHead>
            ))}
            <TableHead className="px-2 py-1 border border-gray-700 text-slate-400">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((d, rid) => (
            <TableRow key={rid} className="h-8 bg-gray-800"> {/* Reduce row height */}
              <TableCell className="px-2 py-2 border border-gray-700">{d.line}</TableCell> {/* Reduce padding */}
              <TableCell className="px-2 py-2 border border-gray-700">{`${d.style}-${d.buyer}`}</TableCell>
              <TableCell className="px-2 py-2 border border-gray-700">{d.smv}</TableCell>
              <TableCell className="px-2 py-2 border border-gray-700">{d.target}</TableCell>
              {Array.from({ length: maxHourGroups }).map((_, id) => (
                <TableCell key={id} className="px-2 py-2 text-center border border-gray-700">{d.hourGroups[id]?.production ?? 0}</TableCell>
              ))}
              <TableCell className="px-2 py-2 border border-gray-700">{d.hourGroups.reduce((acc, next) => acc + (next.production ?? 0), 0)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="h-8 font-bold bg-gray-800"> {/* Footer row for totals */}
            <TableCell className="px-2 py-2 border border-gray-700" colSpan={4}>Total</TableCell>
            {totalProductionPerHour.map((total, idx) => (
              <TableCell key={idx} className="px-2 py-2 text-center border border-gray-700">{total}</TableCell>
            ))}
            <TableCell className="px-2 py-2 border border-gray-700">{totalProductionOverall}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default TableCompo