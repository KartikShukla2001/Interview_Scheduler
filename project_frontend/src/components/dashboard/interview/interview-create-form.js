import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import * as React from "react";
import { MultiSelect } from "../../multi-select";
import NextLink from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  
} from "@mui/material";
import { API_SERVICE } from "../../../config/API";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";


export const InterviewCreateForm = (props) => {
  const [value1, setValue1] = useState(dayjs());
  const [value2, setValue2] = useState(dayjs());
  const [admin, setadmin] = useState("");
  const router = useRouter();
  const [membershipdata, setmembershipdata] = useState([]);
  const [filterItems, setFilterItems] = useState([]);
  const [interviewdata, setinterviewdata] = useState(null);

  useEffect(() => {
    getthemembersipdata();
    if (id) {
      getinterviewdata(id);
    }
  }, []);

  //To get interview data
  const getinterviewdata = async (id) => {
    try {
      const res = await fetch(`${API_SERVICE}/interview/${id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = (await res.json()).data;
      setValue1(dayjs(data.start_time));
      setValue2(dayjs(data.end_time));
      setadmin(data.admin._id);
      setFilterItems(data.participants.map(p => p._id));

      setinterviewdata(content.data);
    } catch (err) {
      console.log(err);
    }
  };

  //To fetch user data
  const getthemembersipdata = async () => {
    try {
      const res = await fetch(`${API_SERVICE}/user`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const content = await res.json();
      const firstAdmin =
        content[content.findIndex((member) => member.isAdmin)]._id;
      setmembershipdata(content);
      setadmin(firstAdmin);
    } catch (err) {
      console.log(err);
    }
  };

  const participantOptions = membershipdata   //Participant Array
    .filter((member) => !member.isAdmin)
    .map((member) => ({ label: member.name, value: member._id }));

  const id = router.query.id; //Interview Id

  //Create Interview
  let handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_SERVICE}/addtointerview`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_name: "test",
          start_time: value1.toISOString(),
          end_time: value2.toISOString(),
          participants: filterItems,
          admin: admin,
        }),
      });
      const content = await res.json();

      toast.success("Interview created!");
      router.push("/dashboard");
    } catch (err) {
      if(err)
      {
        toast.success("Could Not Add Interview")
      }
      console.log(err);
    }
  };

  //Update Interview values
  let updateSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_SERVICE}/updateinterview/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organization_name: "test",
          start_time: value1.toISOString(),
          end_time: value2.toISOString(),
          participants: filterItems,
          admin: admin,
        }),
      });
      const content = await res.json();

      toast.success("Interview updated!");
      router.push("/dashboard");
    } catch (err) {
      if(err)
      {
        toast.success("Could Not Add Interview")
      }
    }
  };

  //Form for Creating and Updating Interviews
  return (
    <>
      {id != undefined ? (
        <form onSubmit={updateSubmit} {...props}>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
                  <Typography variant="h6">Start_Time</Typography>
                </Grid>
                <Grid>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Date&Time picker"
                      value={value1}
                      onChange={(d) => setValue1(d)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
                  <Typography variant="h6">End_Time</Typography>
                </Grid>
                <Grid>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Date&Time picker"
                      value={value2}
                      onChange={(d) => setValue2(d)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
                  <Typography variant="h6">Admin</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                  <select
                    value={admin}
                    onChange={(e) => {
                      setadmin(e.target.value);
                    }}
                    name="timezone_offset"
                    id="timezone-offset"
                    style={{
                      width: "100%",
                      padding: "17px",
                      fontSize: "16px",
                      borderRadius: "10px",
                    }}
                  >
                    {membershipdata.map((membership) => {
                      if (membership.isAdmin)
                        return (
                          <option value={membership._id} key={membership._id}>
                            {membership.name}
                          </option>
                        );
                    })}
                  </select>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
                  <Typography variant="h6">Participant</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                  <MultiSelect
                    value={filterItems}
                    onChange={(e) => setFilterItems(e)}
                    options={participantOptions}
                    name="timezone_offset"
                    id="timezone-offset"
                    style={{
                      width: "100%",
                      padding: "17px",
                      fontSize: "16px",
                      borderRadius: "10px",
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              mx: -1,
              mb: -1,
              mt: 3,
            }}
          >
            <NextLink href="/dashboard">
              <Button sx={{ m: 1 }} variant="outlined">
                Cancel
              </Button>
            </NextLink>

            <Button sx={{ m: 1 }} type="submit" variant="contained">
              Update
            </Button>
          </Box>
        </form>
      ) : (
        <form onSubmit={handleSubmit} {...props}>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
                  <Typography variant="h6">Start_Time</Typography>
                </Grid>
                <Grid>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Date&Time picker"
                      value={value1}
                      onChange={(d) => setValue1(d)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
                  <Typography variant="h6">End_Time</Typography>
                </Grid>
                <Grid>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Date&Time picker"
                      value={value2}
                      onChange={(d) => setValue2(d)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
                  <Typography variant="h6">Admin</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                  <select
                    value={admin}
                    onChange={(e) => setadmin(e.target.value)}
                    name="timezone_offset"
                    id="timezone-offset"
                    style={{
                      width: "100%",
                      padding: "17px",
                      fontSize: "16px",
                      borderRadius: "10px",
                    }}
                  >
                    {membershipdata.map((membership) => {
                      if (membership.isAdmin)
                        return (
                          <option value={membership._id}>
                            {membership.name}
                          </option>
                        );
                    })}
                  </select>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={4} xs={12}>
                  <Typography variant="h6">Participant</Typography>
                </Grid>
                <Grid item md={8} xs={12}>
                  <MultiSelect
                    value={filterItems}
                    onChange={(e) => setFilterItems(e)}
                    options={participantOptions}
                    name="timezone_offset"
                    id="timezone-offset"
                    style={{
                      width: "100%",
                      padding: "17px",
                      fontSize: "16px",
                      borderRadius: "10px",
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              mx: -1,
              mb: -1,
              mt: 3,
            }}
          >
            <NextLink href="/dashboard">
              <Button sx={{ m: 1 }} variant="outlined">
                Cancel
              </Button>
            </NextLink>
            <Button sx={{ m: 1 }} type="submit" variant="contained">
              Create
            </Button>
          </Box>
        </form>
      )}
    </>
  );
};
