import axios from "axios";
import { useQuery } from "react-query";
import { Forecast } from "../types/forecast";

const fetchProjectForecast = async (): Promise<Forecast[]> => {
    const { data } = await axios.get("/project-forecast");
    console.log(data);
    return data;
};

export function useProjectForecast() {
    return useQuery("forecasts", () => fetchProjectForecast());
}