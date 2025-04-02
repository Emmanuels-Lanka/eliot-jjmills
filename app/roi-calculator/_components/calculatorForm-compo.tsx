"use client";

import React, { useState } from 'react';
import Image from 'next/image';

import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { min } from 'moment-timezone';


export type formDataType = {
    currentDailyProduction : number;
    newDailyProduction : number;
    totDailyProduction : number;
    totNewDailyProduction : number;
    additionalGarmentPerDay : number;
    additionalGarmentPerMonth : number;
    additionalRevenuePerMonth : number;
    additionalCostPerMonth : number;
    additionalProfitPerMonth : number;
    additionalProfitPerYear : number;
}

const formSchema = z.object({
    sewingMachines: z.coerce.number().min(1, {
        message: "required",
      }),
    smv: z.coerce.number().min(1),
    line: z.coerce.number().min(1),
    workHours: z.coerce.number().min(1),
    workDays: z.coerce.number().min(1),
    currentOperEfficiency: z.coerce.number().min(-1),
    newOperEfficiency: z.coerce.number().min(-1),
    price: z.coerce.number().min(1),
    cost: z.coerce.number().min(1)
});

const CalculatorForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          sewingMachines: undefined,
          smv: undefined,
          workHours: undefined,
          workDays: undefined,
          currentOperEfficiency: undefined,
          newOperEfficiency: undefined,
          price: undefined,
          cost: undefined,
          line: 1,
        },
      });

      const { isSubmitting, isValid } = form.formState;
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [formData,setFormData] = useState<any>()
      const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data);
    
        const {
          sewingMachines,
          smv,
          workHours,
          workDays,
          currentOperEfficiency,
          newOperEfficiency,
          price,
          cost,
          line,
        } = data;
    
        const currentProduction = (
          (sewingMachines * workHours * 60 * (currentOperEfficiency / 100)) / smv);
        const newProduction = (
          (sewingMachines * workHours * 60 * (newOperEfficiency / 100)) / smv);

        const totDailyProduction = currentProduction * line

        const totNewDailyProduction = newProduction * line

        const additionalGarmentPerDay = totNewDailyProduction - totDailyProduction

        const additionalGarmentPerMonth = additionalGarmentPerDay * workDays

        const additionalRevenuePerMonth = additionalGarmentPerMonth * price
        
        const additionalCostPerMonth = additionalGarmentPerMonth * cost

        const additionalProfitPerMonth = additionalRevenuePerMonth - additionalCostPerMonth

        const additionalProfitPerYear = additionalProfitPerMonth * 12
    
        const passData:formDataType = {
            currentDailyProduction : currentProduction,
            newDailyProduction : newProduction,
            totDailyProduction : totDailyProduction,
            totNewDailyProduction : totNewDailyProduction,
            additionalGarmentPerDay : additionalGarmentPerDay,
            additionalGarmentPerMonth : additionalGarmentPerMonth,
            additionalRevenuePerMonth : additionalRevenuePerMonth,
            additionalCostPerMonth : additionalCostPerMonth,
            additionalProfitPerMonth : additionalProfitPerMonth,
            additionalProfitPerYear : additionalProfitPerYear
        }
    
        console.log(passData)
        setFormData(passData)
        setIsModalOpen(true); // Open the modal
    
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

  return (
    <>
      <div className="rounded-lg shadow-lg w-full h-full m-4 p-6 bg-white">
        <div className="mx-auto max-w-5xl border px-8 py-10 rounded-lg bg-slate-100">
          <Form {...form}>
            <form
              className="w-full space-y-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                {/* Number of Lines */}
                <FormField
                  control={form.control}
                  name="line"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Lines</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sewing Machines */}
                <FormField
                  control={form.control}
                  name="sewingMachines"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sewing Machines</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 43"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SMV */}
                <FormField
                  control={form.control}
                  name="smv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMV (Standard Minutes)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 1.67"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                {/* Working Hours */}
                <FormField
                  control={form.control}
                  name="workHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Hours per Day</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 8"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Working Days */}
                <FormField
                  control={form.control}
                  name="workDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Days per Month</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 26"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Current Operator Efficiency */}
                <FormField
                  control={form.control}
                  name="currentOperEfficiency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Operator Efficiency (%)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* New Operator Efficiency */}
                <FormField
                  control={form.control}
                  name="newOperEfficiency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Operator Efficiency (%)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 51"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price per Garment ($)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 5"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cost */}
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost per Garment ($)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white hover:bg-blue-500 rounded-lg transition"
                >
                  Calculate
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="mx-4 flex items-center justify-center gap-4">
              <Image src={"/eliot-logo.png"} alt=" " height={150} width={150} />
              <h2 className="text-[#0071c1] my-4 text-2xl">
                ROI Calculation Results
              </h2>
            </div>

            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Description</TableHead>
                    <TableHead className="text-right">Values</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
    
                    <TableRow>
                      <TableCell className="font-light w-[300px]"> Current Daily Production: </TableCell>
                      <TableCell className="text-right"> {formData?.currentDailyProduction.toFixed(2)} </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-light w-[300px]"> New Daily Production: </TableCell>
                      <TableCell className="text-right"> {formData?.newDailyProduction.toFixed(2)} </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-light w-[300x]"> Total Daily Production: </TableCell>
                      <TableCell className="text-right"> {formData?.totDailyProduction.toFixed(2)} </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-light w-[300x]"> Total New Daily Production: </TableCell>
                      <TableCell className="text-right"> {formData?.totNewDailyProduction.toFixed(2)} </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-light w-[300x]"> Additional Garment per Day: </TableCell>
                      <TableCell className="text-right"> {formData?.additionalGarmentPerDay.toFixed(2)} </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-light w-[300x]"> Additional Garment per Month: </TableCell>
                      <TableCell className="text-right"> {formData?.additionalGarmentPerMonth.toFixed(2)} </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-light w-[300x]"> Additional Revenue per Month: </TableCell>
                      <TableCell className="text-right">$ {formData?.additionalRevenuePerMonth.toFixed(2)} </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-light w-[300x]"> Additional Cost per Month: </TableCell>
                      <TableCell className="text-right">$ {formData?.additionalCostPerMonth.toFixed(2)} </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-light w-[300x]"> Additional Profit per Month: </TableCell>
                      <TableCell className="text-right">$ {formData?.additionalProfitPerMonth.toFixed(2)} </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-light w-[300x]"> Additional Profit per Year: </TableCell>
                      <TableCell className="text-right">$ {formData?.additionalProfitPerYear.toFixed(2)} </TableCell>
                    </TableRow>
                 
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right">
                      <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-red-500"
                      >
                        Close
                      </button></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CalculatorForm
