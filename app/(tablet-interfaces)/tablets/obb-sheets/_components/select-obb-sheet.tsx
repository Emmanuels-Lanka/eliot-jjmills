import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

interface SelectObbSheetProps {
    obbSheets: {
        id: string;
        style: string;
        colour: string | null;
        buyer: string;
    }[];
}

const SelectObbSheet = ({ obbSheets }: SelectObbSheetProps) => {
    return (
        <div className='mt-8'>
            {obbSheets.length > 0 ? (
                <div className='flex flex-wrap gap-8'>
                    {obbSheets.map(obb => (
                        <Link key={obb.id} href={`/tablets/obb-sheets/${obb.id}`}>
                            <div className='group p-4 flex items-center gap-x-8 bg-slate-100 border rounded-lg text-slate-800 hover:border-slate-500'>
                                <p className='font-medium'>{obb.style}</p>
                                <Separator orientation='vertical' className='bg-slate-400 h-4 w-0.5 rounded-lg'/>
                                {obb.colour &&
                                    <Badge style={{ color: obb.colour || 'black' }} className='bg-slate-200 hover:bg-slate-300'>
                                        {obb.colour}
                                    </Badge>
                                }
                                <p>{obb.buyer}</p>
                                <ArrowRight className='text-slate-500 group-hover:text-slate-800'/>
                            </div>
                        </Link>
                    ))}
                </div>
            ) :
                <p>Please create / activate the obb sheets</p>
            }
        </div>
    )
}

export default SelectObbSheet