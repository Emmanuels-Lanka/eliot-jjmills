import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { operationId: string } }
) {
    try {
        const existingOperationById = await db.operation.findUnique({
            where: {
                id: params.operationId
            }
        });

        if (!existingOperationById) {
            return new NextResponse("Operation is not created yet!", { status: 409 })
        }

        const deletedOperation = await db.operation.delete({
            where: {
                id: params.operationId
            }
        });

        return new NextResponse("Operation removed successfully", { status: 201 })
    } catch (error) {
        console.error("[DELETE_OPERATION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { operationId: string } }
) {
    try {
        const { name, code } = await req.json();

        const formattedName: string = name.toUpperCase();
        const formattedCode: string = code.toUpperCase();

        const existingOperationById = await db.operation.findUnique({
            where: {
                id: params.operationId
            }
        });

        if (!existingOperationById) {
            return new NextResponse("The operation does not exist", { status: 409 })
        };

        const updatedOperation = await db.operation.update({
            where: {
                id: params.operationId
            },
            data: {
                name: formattedName,
                code: formattedCode
            }
        });

        return NextResponse.json({ data: updatedOperation, message: 'Operation updated successfully'}, { status: 201 });
        
    } catch (error) {
        console.error("[UPDATE_OPERATION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}