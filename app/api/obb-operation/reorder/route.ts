import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function PUT(
    req: Request
) {
    const { obbOperations } = await req.json();

    try {
        const updatePromises = obbOperations.map((operation: { id: string; seqNo: number }) => 
            db.obbOperation.update({
                where: { id: operation.id },
                data: { seqNo: operation.seqNo },
            })
        );
        await Promise.all(updatePromises);

        return NextResponse.json({ message: 'Sequence updated successfully' }, { status: 200 });
    } catch (error) {
        console.error("[OBB_OPERATION_REORDER_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
