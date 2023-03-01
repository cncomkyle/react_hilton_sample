import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react';
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

export default function CheckReservationsPage() {
    const navigate = useNavigate();
    function UpdateStatus(id, status) {

        const update = async () => {
            await axios
                .post("http://localhost:3000/updateStatus",
                    {
                        reservationId: id,
                        status: status,
                    })
                .then(response => {
                    console.log(response)
                    // Handle response
                    fetchData();
                })
                .catch(err => {
                    console.log(err)
                })
        }

        update()
        
    }

    const TABLE_COLUMNS = [
        {
            Header: 'User Name',
            accessor: 'userName',
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
            Header: 'Timeout',
            accessor: 'timeout_date_time',
        },
        {
            Header: 'Mobile',
            accessor: 'mobile',
        },
        {
            Header: 'Status',
            accessor: 'status',
        },
        {
            Header: 'ID',
            accessor: 'id',
        },
        {
            Header: 'Cancel',
            Cell: cell => (
                cell.row.values.status === 'booked' || cell.row.values.status === 'confirmed' ? (
                    <div>
                        <button value={cell.row.values.id} onClick={() => { UpdateStatus(cell.row.values.id, 'canceled') }}>
                            Cancel
                        </button>
                    </div>
                ) : (
                    <text>

                    </text>

                )
            ),

        },
        {
            Header: 'Confirm',
            Cell: cell => (
                cell.row.values.status === 'booked' ? (
                    <div>
                        <button value={cell.row.values.id} onClick={() => { UpdateStatus(cell.row.values.id, 'confirmed') }}>
                            Confirm
                        </button>
                    </div>
                ) : (
                    <text>

                    </text>

                )
            ),

        },


    ];

    const [data, setData] = useState([]);
    const columns = useMemo(() => TABLE_COLUMNS, []);

    const [userName, setUserName] = useState('')
    const [mobile, setMobile] = useState('')
    const [status, setStatus] = useState('')
    const [reserve_date, setReserve_date] = useState(); //useState(dayjs(new Date()).format('YYYY/MM/DD'))


    const [value, setValue] = React.useState('/checkReservations');
    const handleChange = (event, newValue) => {
        setValue(newValue);
        navigate(newValue);
    };
    const logOff = () => {
        setAuthToken()
        navigate('/')
    }

    const handleSearch = async (e) => {
        const isEmployee = localStorage.getItem("isEmployee") === 'employee';
        // Prevent the default submit and page reload
        e.preventDefault()

        // Handle validations

        const params = new URLSearchParams([]);
        if (!isEmployee) {
            params.append("userId", localStorage.getItem("userId"));
        }
        if (userName && userName.trim().length) {
            localStorage.setItem("userNameSearch", userName)
            params.append("userName", userName);
        }
        if (mobile && mobile.trim().length) {
            localStorage.setItem("mobileSearch", mobile)
            params.append("mobile", mobile);
        }
        if (status && status.trim().length) {
            localStorage.setItem("statusSearch", status)
            params.append("status", status);
        }
        if (reserve_date && reserve_date.trim().length) {
            localStorage.setItem("dateSearch", reserve_date)
            params.append("reserve_date", reserve_date);
        }

        await axios
            .get("http://localhost:3000/getReservations", { params })
            .then(response => {
                console.log(response)
                //handleShow()
                // Handle response
                setData(response.data)
            })
            .catch(err => {
                console.log(err)
            })
        // navigate(0)

    }

    const fetchData = async () => {
        const isEmployee = localStorage.getItem("isEmployee") === 'employee';
        const params = new URLSearchParams([]);
        
        if (!isEmployee) {
            params.append("userId", localStorage.getItem("userId"));
        }
        let userNameStr = localStorage.getItem("userNameSearch")
        if (userNameStr && userNameStr.trim().length) {
            params.append("userName", userNameStr);
        }
        let mobileStr = localStorage.getItem("mobileSearch")
        if (mobileStr && mobileStr.trim().length) {
            params.append("mobile", mobileStr);
        }
        let statusStr = localStorage.getItem("statusSearch")
        if (statusStr && statusStr.trim().length) {
            params.append("status", statusStr);
        }
        let dateStr = localStorage.getItem("dateSearch")
        if (dateStr && dateStr.trim().length) {
            params.append("reserve_date", dateStr);
        }

        const token = localStorage.getItem("token");

        setAuthToken(token)

        await axios
            .get("http://localhost:3000/getReservations", { params })
            .then(response => {
                setData(response.data)
            })
            .catch(err => {
                console.log(err)
            })
    };

    useEffect(() => {
        localStorage.setItem("userNameSearch", "")
        localStorage.setItem("mobileSearch", "")
        localStorage.setItem("statusSearch", "")
        localStorage.setItem("dateSearch", "")
        fetchData();
    }, []);

    const isEmployee = localStorage.getItem("isEmployee") === 'employee';
    const initialState = isEmployee ? { hiddenColumns: ['id',] } : { hiddenColumns: ['id', 'Confirm'] };


    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({ columns, data, initialState });


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
                {isEmployee && (
                    <div>
                        <form action="" id="reverseTable" >
                             <p className="item">
                                &nbsp;
                            </p>
                            <p className="item">
                                <label for="userName"> User Name </label>
                                <input
                                    type="userName"
                                    name="userName"
                                    id="userName"
                                    value={userName}
                                    onChange={e => setUserName(e.target.value)}
                                />
                            </p>
                            <p className="item">
                                <label for="mobile"> Mobile Phone Number</label>
                                <input
                                    type="mobile"
                                    name="mobile"
                                    id="mobile"
                                    value={mobile}
                                    onChange={e => setMobile(e.target.value)}
                                />
                            </p>
                            <p className="item">
                                <label for="status">Status</label>
                                <select name="status" id="status" value={status} onChange={e => setStatus(e.target.value)}>
                                <option value="">All</option>
                                    <option value="booked">booked</option>
                                    <option value="canceled">canceld</option>
                                    <option value="confirmed">confirmed</option>
                                </select>
                                
                            </p>
                            <p className="item">
                                <label for="reserve_date_time"> Reserve Date</label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        views={['day']}
                                        label="Just date"
                                        value={reserve_date}
                                        inputFormat="YYYY/MM/DD"
                                        onChange={(newValue) => {
                                            setReserve_date(dayjs(newValue).format('YYYY/MM/DD'));
                                        }}
                                        renderInput={(params) => <TextField {...params} helperText={null} />}
                                    />
                                </LocalizationProvider>
                            </p>
                        </form>
                        <input type="button" value="Search" onClick={handleSearch} />
                    </div>
                )}
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