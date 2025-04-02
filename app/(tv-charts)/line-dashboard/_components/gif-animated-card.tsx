import { cn } from '@/lib/utils';

interface GifAnimatedCardProps {
    label: string;
    value: string;
    image: string;
    color: string;
    imgSize?: string;
    textSize?: "small" | "medium" | "large";
    long?:boolean
    icon?: React.ReactNode
}

const GifAnimatedCard = ({
    label,
    value,
    image,
    color,
    imgSize,
    long = false,
    textSize = "small",
    icon
}: GifAnimatedCardProps) => {
    const fontSize = textSize === "small" ? "text-2xl" : textSize === "medium" ? "text-3xl" : "text-6xl";

    return (
        <div className='h-full w-full bg-slate-900 pt-4 pb-4 flex flex-col justify-between border-slate-500 items-center gap-x-2 rounded-xl shadow-lg transition-transform duration-300 hover:shadow-2xl hover:translate-y-1 border'>
            <div className='w-full flex items-center pl-4 pr-4'>
                <p className={cn("w-3/5 z-10 text-center  font-semibold", color, fontSize)}>{value ? value.toUpperCase() : "NAN"}</p>
                <div className='w-2/5 '>
                    { !icon ? <img
                        src={image}
                        alt={label}
                        // className={cn("-mr-4 pointer-events-none", imgSize ? `${imgSize} p-1` : "size-[12vh]")}
                        className='w-full rounded-full'
                    /> : 
                    <div>
                    {
                        icon && 
                        <div className=' ml-2 rounded-full'>
                        {icon}
                        </div>
                    }
                    </div>
                    }
                </div>
            </div>
            <p className={`px-2 w-full ${long ? 'text-sm': 'text-xl'} text-center font-medium text-slate-300 tracking-[0.01em]`}>{label}</p>
        </div>
    )
}

export default GifAnimatedCard