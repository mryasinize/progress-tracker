import { useState, useEffect, useRef, useContext } from "react";
import { useAppContext } from "../context/AppContext";

export default function CountdownTimer() {
    const { deadline, setDeadline } = useAppContext()
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [showDatePickerOption, setShowDatePickerOption] = useState(false);
    const deadlineRef = useRef(deadline);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const saveDealline = () => {
        clearInterval(intervalRef.current)
        calculateTime(deadlineRef.current)
        setShowDatePickerOption(false)
        intervalRef.current = setInterval(() => calculateTime(deadlineRef.current), 1000);
        setDeadline(deadlineRef.current)
    }

    const calculateTime = (targetDate: string) => {
        const now = new Date();
        const distance = Math.floor((new Date(targetDate) - now) / 1000);
        setSecondsLeft(distance > 0 ? distance : 0);

    }

    const formatTime = (totalSeconds: number) => {
        const days = Math.floor(totalSeconds / (60 * 60 * 24));
        const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n: any) => String(n).padStart(2, '0');

        return `${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`;
    };

    useEffect(() => {
        clearInterval(intervalRef.current)
        calculateTime(deadline)
        intervalRef.current = setInterval(() => calculateTime(deadline), 1000);
        return () => clearInterval(intervalRef.current)
    }, []);

    return (
        <div className="flex flex-col items-center gap-4">
            {showDatePickerOption ?
                <div className="__center gap-2">
                    <input
                        type="date"
                        defaultValue={deadlineRef.current}
                        onChange={(e) => deadlineRef.current = e.target.value}
                        className="border p-2 h-10 rounded-lg outline-none"
                    />
                    <div className="flex gap-2 dark:text-white/90" onClick={saveDealline}>
                        <button title="Confirm deadline">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        </button>
                        <button title="Cancel" onClick={() => setShowDatePickerOption(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div> :
                <div className="text-3xl select-none group relative dark:text-white/90">
                    <button onClick={() => setShowDatePickerOption(true)} className="text-gray-400 __center gap-1 active:scale-95 absolute right-0 -top-5 hidden group-hover:flex">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                        </svg>
                        <span className="text-sm">Edit</span>
                    </button>
                    {formatTime(secondsLeft)}
                </div>
            }
        </div>
    );
}
