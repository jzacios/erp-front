import React, {useState, useEffect} from "react";
import { useTranslation } from "react-i18next";
import ForecastTable from "../components/ForecastsTable";
import AdminAppBar from "../../admin/components/AdminAppBar";
import AdminToolbar from "../../admin/components/AdminToolbar";
import { useProjectForecast } from "../hooks/useProjectForecast";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import moment from "moment";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { useCanAccess } from "../../core/hooks/useCanAccess";
import { Navigate } from "react-router";


const ForecastManagement = () => {
    const [openForecastDialog, setOpenForecastDialog] = useState('');
    const [currentYear, setCurrentYear] = useState(moment().format('YYYY'));
    const [currentMonth, setCurrentMonth] = useState(moment().format('MM'));

    const data = useProjectForecast()

    const [forecasts, setForecasts] = useState(data);



    const { t } = useTranslation();

    const monthBackward = () => {
        if(parseInt(currentMonth) != 1){
            setCurrentMonth(String(parseInt(currentMonth)-1));
        }else{
            setCurrentMonth('12');
            setCurrentYear(String(parseInt(currentYear)-1));
        }
    }
    const monthForward = () => {
        if(parseInt(currentMonth) != 12){
            setCurrentMonth(String(parseInt(currentMonth)+1));
        }else{
            setCurrentMonth('1');
            setCurrentYear(String(parseInt(currentYear)+1));
        }
    }
    
    if(!useCanAccess('administration_forecast')){
        return <Navigate to="/" />
      }

    return (
        <React.Fragment>
            <AdminAppBar>
                <AdminToolbar title={t("forecastManagement.toolbar.title")}>
                    <ArrowBackIosIcon onClick={() => monthBackward()}/>
                        {t("forecastManagement.toolbar.month."+currentMonth)} {currentYear}
                    <ArrowForwardIosIcon onClick={() => monthForward()}/>
                </AdminToolbar>
            </AdminAppBar>
            <ForecastTable
                forecasts={forecasts.data}
                processing={!data.isFetching}
                year={currentYear}
                month={currentMonth}
            />
        </React.Fragment>
    )
}

export default ForecastManagement;