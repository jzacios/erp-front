import React, { useState, useEffect, useRef } from "react";
import { TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Checkbox, Table, Button} from "@material-ui/core";
import Empty from "../../core/components/Empty";
import { useTranslation } from "react-i18next";
import * as selectUtils from "../../core/utils/selectUtils";
import { Forecast } from "../types/forecast";
import XLSX from 'xlsx';
import DownloadIcon from '@material-ui/icons/Download';
interface HeadCell {
    id: string;
    label: string;
    align: "center" | "left" | "right";
}

const headCells: HeadCell[] = [
    {
        id: "id",
        align: "left",
        label: "forecastManagement.table.headers.id",
    },
    {
        id: "company",
        align: "center",
        label: "forecastManagement.table.headers.company"
    }, 
    {
        id: "number",
        align: "center",
        label: "forecastManagement.table.headers.number"
    }, 
    {
        id: "name",
        align: "center",
        label: "forecastManagement.table.headers.name"
    },
    {
        id: "value",
        align: "center",
        label: "forecastManagement.table.headers.value"
    },
    {
        id: "manager",
        align: "center",
        label: "forecastManagement.table.headers.manager"
    }
];

interface EnhancedTableProps {
    rowCount: number;
}

function EnhancedTableHead({
    rowCount,
}: EnhancedTableProps) {
    const { t } = useTranslation();


    return (
        <TableHead>
            <TableRow sx={{ "& th": { border: 0 } }}>
                {headCells.map((headCell) => (
                    <TableCell key={headCell.id} align={headCell.align} sx={{ py:0 }}>
                        {t(headCell.label)}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

type ForecastRowProps = {
    index: number;
    processing: boolean;
    forecast: Forecast;
};

const ForecastRow = ({
    index,
    forecast,
}: ForecastRowProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { t } = useTranslation();
    
    const labelId = `enchanced-table-checkbox-${index}`;
    const openActions = Boolean(anchorEl);


    return (
        <TableRow
            tabIndex={-1}
            key={forecast.id}
            sx={{ "& td": { bgcolor: "background.paper", border: 0} }}
        >
            <TableCell align="left" sx={{ borderTopLeftRadius: "1rem", borderBottomLeftRadius: "1rem" }}>{index+1}</TableCell>
            <TableCell align="center">{forecast.company}</TableCell>
            <TableCell align="center">{forecast.number}</TableCell>
            <TableCell align="center">{forecast.name}</TableCell>
            <TableCell align="center">{forecast.forecast}</TableCell>
            <TableCell align="center" sx={{ borderTopRightRadius: "1rem", borderBottomRightRadius: "1rem"}}>{forecast.manager}</TableCell>
        </TableRow>
    );
};

type ForecastTableProps = {
    processing: boolean;
    forecasts?: Forecast[];
    year: string;
    month: string;
};

const ForecastTable = ({
    processing,
    forecasts = [],
    year,
    month
}: ForecastTableProps) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState(forecasts);
    useEffect(() => {
        const newData = forecasts.filter(function(el) {
            return el.year == year &&
                    el.month == month;
        })
        setData(newData);
    }, [year, month])


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const downloadExcel = () => {
        const workSheet = XLSX.utils.json_to_sheet(data);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "forecasts");

        let buf = XLSX.write(workBook, {bookType: "xlsx", type: "buffer"});

        XLSX.write(workBook, {bookType: "xlsx", type: "binary"});

        XLSX.writeFile(workBook, "Forecasts.xlsx");
    }


    if (data.length === 0) {
        return <Empty title="Nie ma żadnych prognóz" />;
    }
    return(
        <React.Fragment>
            <DownloadIcon onClick={downloadExcel} />
            <TableContainer>
                <Table
                    aria-labelledby="tableTitle"
                    sx={{
                        minWidth: 600,
                        borderCollapse: "separate",
                        borderSpacing: "0 1rem",
                    }}
                >
                    <EnhancedTableHead
                        rowCount={forecasts.length}
                    />
                    <TableBody>
                        {data
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((forecast, index) => (
                                <ForecastRow
                                    index={index}
                                    key={forecast.id}
                                    processing={processing}
                                    forecast={forecast}
                                />
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={forecasts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </React.Fragment>
    );
};

export default ForecastTable;