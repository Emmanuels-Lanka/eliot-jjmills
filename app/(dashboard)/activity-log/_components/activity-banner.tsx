import { Badge } from "@/components/ui/badge";

interface ActivityBannerProps {
    part: string;
    activity: string;
    timestamp: string;
}

const ActivityBanner = ({
    part,
    activity,
    timestamp
}: ActivityBannerProps) => {
    return (
        <div className="px-4 pt-3 pb-4 bg-gray-100 rounded-lg border">
            <p>{activity}</p>
            <div className="mt-4 flex items-center gap-4">
                <Badge>{part}</Badge>
                <p className="text-slate-600 text-sm font-medium">{timestamp}</p>
            </div>
        </div>
    )
}

export default ActivityBanner