import React from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useState } from "react"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Button as ButtonMui } from "@mui/material";
import Stack from '@mui/material/Stack';

import dayjs from 'dayjs';
import TextField from '@mui/material/TextField';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { setAuthToken } from "./LoginPage";

import { Modal, Button } from 'react-bootstrap'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'


export default function ReserveTablePage() {
    const navigate = useNavigate();
    const [tabValue, setTabValue] = React.useState('/reserveTable');
    const handleChange = (event, newValue) => {
        setValue(newValue);
        navigate(newValue);
    };

    const logOff = () => {
        setAuthToken()
        navigate('/')
    }

    const [value, setValue] = React.useState(dayjs(new Date()));

    const [show, setShow] = useState(false);
    const [warnMsg, setWarnMsg] = useState();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const handleSubmit = async (e) => {
        // Prevent the default submit and page reload
        e.preventDefault()

        // Handle validations
        await axios
            .post("http://localhost:3000/createReservation",
                {
                    size: size,
                    userId:  localStorage.getItem("userId"),
                    userName: userName,
                    mobile: mobile,
                    reserve_date_time: reserve_date + ' ' + reserve_time,
                })
            .then(response => {
                console.log(response)
                // Handle response
                if(response.data.status == 200) {
                    navigate('/checkReservations')
                } else {
                    setWarnMsg(response.data.message)
                    handleShow()
                }
            })
            .catch(err => {
                console.log(err)
            })
        

    }

    const [size, setSize] = useState('2')
    const [userName, setUserName] = useState()
    const [mobile, setMobile] = useState()
    const [reserve_date, setReserve_date] = useState(dayjs(new Date()).format('YYYY/MM/DD'))
    const [reserve_time, setReserve_time] = useState('11:30:00')

    return (

        <Box sx={{ width: '100%' }}>
            <Stack direction="row" spacing={2}>
            <Tabs
                value={tabValue}
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
            >
                <Tab value="/reserveTable" label="Reserve Table" />
                <Tab value="/checkReservations" label="Check Reservations" />
            </Tabs>
            <ButtonMui variant="contained" onClick={logOff}>Logoff</ButtonMui>
            </Stack>

            <div>

                <form action="" id="reverseTable" method="post" onSubmit={handleSubmit}>
                    <h1>Please Reserve Table</h1>
                    <p className="item">
                        <label for="size"> Table Size </label>
                        {/* <input
                        type=""
                        name="size"
                        id="size"
                        value={size}
                        onChange={e => setSize(e.target.value)}
                    /> */}
                        <select name="size" id="size " value={size} onChange={e => setSize(e.target.value)}>
                            <option value="2">2 Seats</option>
                            <option value="4">4 Seats</option>
                            <option value="10">10 Seats</option>

                        </select>
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
                        <select name="reserve_time" id="reserve_time" value={reserve_time} onChange={e => setReserve_time(e.target.value)}>
                            <option value="11:30:00">11:30:00 AM</option>
                            <option value="17:30:00">17:30:00 PM</option>
                        </select>
                    </p>
                    <p className="item">
                        <input type="submit" value="Reserve Table" />
                    </p>
                </form>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning </Modal.Title>
                </Modal.Header>
                <Modal.Body>{warnMsg}</Modal.Body>
                <Modal.Footer>
                    <Button variant="Yes" onClick={handleClose}>
                        Close
                    </Button>
                    
                </Modal.Footer>
            </Modal>
        </Box>
    );
}