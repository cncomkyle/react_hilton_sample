import React from "react";
import { useNavigate } from "react-router-dom";
import { useState,  useMemo } from 'react';
import { useTable } from 'react-table';
//import { TABLE_COLUMNS } from './table_column';
import axios from "axios"
import '../index.css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Button } from "@mui/material";
import Stack from '@mui/material/Stack';
import { setAuthToken } from "./LoginPage";

import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function ReviewTablesStatusPage() {
    const navigate = useNavigate();
    

    const TABLE_COLUMNS = [
        {
            Header: 'Table No.',
            accessor: 'tableNo',
        },
        {
            Header: 'Table Size',
            accessor: 'size',
        },
        {
            Header: 'Reserve Date Time',
            accessor: 'reserve_date_time',
        },
        {
            Header: 'User Name',
            accessor: 'userName',
        },
        {
            Header: 'Mobile',
            accessor: 'mobile',
        },
        {
            Header: 'Status',
            accessor: 'status',
        },
       
    ];

    const [data, setData] = useState([]);
    const columns = useMemo(() => TABLE_COLUMNS, []);
  
    const [check_date, setCheck_date] = useState(dayjs(new Date()).format('YYYY/MM/DD'));
    const [check_time, setCheck_time] = useState("11:30:00"); 


    const [value, setValue] = React.useState('/reviewTableStatus');

    const handleChange = (event, newValue) => {
        setValue(newValue);
        navigate(newValue);
    };
    const logOff = () => {
        setAuthToken()
        navigate('/')
    }

    const checkTableStatus = async (e) => {
        
        // Prevent the default submit and page reload
        e.preventDefault()
        await axios
            .post("http://localhost:3000/graphql", 
            {
                query : `{ 
                    reservedTables(reserve_date_time:"${check_date} ${check_time}")
                    {tableNo,size,userName, status,reserve_date_time, mobile} 
                }`
            })
            
            .then(response => {
                console.log(response)
                //handleShow()
                // Handle response
                setData(response.data.data.reservedTables)
            })
            .catch(err => {
                console.log(err)
            })
        // navigate(0)

    }

    const isEmployee = localStorage.getItem("isEmployee") === 'employee';
    
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data });


    return (
        <Box sx={{ width: '100%' }}>
            <Stack direction="row" spacing={2}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    <Tab value="/reserveTable" label="Reserve Table" />
                    <Tab value="/checkReservations" label="Check Reservations" />
                    {isEmployee && (
                        <Tab value="/reviewTableStatus" label="Check Table Status" />
                    )}
                </Tabs>
                <Button variant="contained" onClick={logOff}>Logoff</Button>
            </Stack>
            <div className="container">
                
                    <div>
                        <form action="" id="reverseTable" >
                            <p className="item">
                                &nbsp;
                            </p>
                            <p className="item">
                                <label> Check Date Time</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        views={['day']}
                                        label="Just date"
                                        value={check_date}
                                        inputFormat="YYYY/MM/DD"
                                        onChange={(newValue) => {
                                            setCheck_date(dayjs(newValue).format('YYYY/MM/DD'));
                                        }}
                                        renderInput={(params) => <TextField {...params} helperText={null} />}
                                    />
                                </LocalizationProvider>
                                <select name="check_time" id="check_time" value={check_time} onChange={e => setCheck_time(e.target.value)}>
                                    <option value="11:30:00">11:30:00 AM</option>
                                    <option value="17:30:00">17:30:00 PM</option>
                                </select>
                            </p>
                        </form>
                        <input type="button" value="Check Table Status" onClick={checkTableStatus} />
                    </div>
                
                <table {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>
                                        {column.render('Header')}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td {...cell.getCellProps()}>
                                                {cell.render('Cell')}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

        </Box>

    );
}