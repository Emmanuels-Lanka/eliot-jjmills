import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

const TableComponent = ({data}:{data:any}) => {
  return (
    <div><Table>
    <TableHeader>
      <TableRow>
        <TableHead>Seq No</TableHead>
        <TableHead>Operator Name</TableHead>
        <TableHead className="hidden sm:table-cell">
        Employee ID
        </TableHead>
        <TableHead className="hidden sm:table-cell">
        Machine ID
        </TableHead>
        <TableHead className="">
        ELIOT ID
        </TableHead>
        <TableHead className="">
        Operation Code
        </TableHead>
        <TableHead className="">
        Operation Name
        </TableHead>
        
        <TableHead className="">
        Live Total Production
        </TableHead>
        {/* <TableHead className="">
        Login Time
        </TableHead>
        <TableHead className="">
        Logout Time
        </TableHead> */}
        <TableHead className="">
        Target
        </TableHead>
       
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((d:any)=>(

     
      <TableRow key={d.rid} className="bg-accent">
        <TableCell>
          <div className="font-medium">{d.seqNo}</div>
        </TableCell>
        <TableCell>
          <div className="font-medium">{d.name}</div>
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          {d.employeeId}
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          {d.machineId}
        </TableCell>
        <TableCell className="">
          {d.eliotSerialNumber}
        </TableCell>
        <TableCell className="text-right">{d.code}</TableCell>
        <TableCell className="text-right">{d.operationname}</TableCell>
        <TableCell className="text-center">{d.totprod}</TableCell>
        {/* <TableCell className="text-right">{d.LoginTimestamp}</TableCell>
        <TableCell className="text-right">{d.LogoutTimestamp}</TableCell> */}
        <TableCell className="text-left">{d.target}</TableCell>
        
      </TableRow>
      ))}

    </TableBody>
  </Table></div>
  )
}

export default TableComponent