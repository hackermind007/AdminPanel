import React, { useEffect, useState } from "react";
import ThemeDash from "../Compnents/ThemeDash";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Switch,
  TableCell,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import TextField from "../Compnents/TextField";
import { useFormik } from "formik";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import { useTheme } from "@mui/material/styles";
import { HashLoader } from "react-spinners";

const Category = () => {
  const token = localStorage.getItem("token");
  const [category, setCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [eid, setEid] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Mobile view check

  const formik = useFormik({
    initialValues: { catagoryName: "" },
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const url = eid
          ? `https://interviewhub-3ro7.onrender.com/catagory/${eid}`
          : "https://interviewhub-3ro7.onrender.com/catagory/create";
        const method = eid ? "patch" : "post";
        await axios[method](url, values, { headers: { Authorization: token } });
        toast.success("Category saved successfully");
        resetForm();
        setEid(null);
        handleClose();
        dataFetch();
      } catch (error) {
        toast.error("An error occurred.");
      } finally {
        setLoading(false);
      }
    },
  });

  const dataFetch = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://interviewhub-3ro7.onrender.com/catagory/", {
        headers: { Authorization: token },
      });
      setCategory(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`https://interviewhub-3ro7.onrender.com/catagory/${id}`, {
        headers: { Authorization: token },
      });
      toast.success("Category deleted successfully.");
      dataFetch();
    } catch (error) {
      toast.error("Failed to delete category.");
    } finally {
      setLoading(false);
    }
  };

  const switchToggle = async (id) => {
    const selectedData = category.find((item) => item._id === id);
    const updatedStatus = selectedData.status === "on" ? "off" : "on";

    try {
      await axios.patch(
        `https://interviewhub-3ro7.onrender.com/catagory/${id}`,
        { status: updatedStatus },
        { headers: { Authorization: token } }
      );
      dataFetch();
    } catch (error) {
      toast.error("Failed to update status.");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const handleClose = () => {
    setOpen(false);
    setEid(null);
    formik.resetForm();
  };

  useEffect(() => {
    dataFetch();
  }, []);

  return (
    <ThemeDash>
      <ToastContainer />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <HashLoader color="#122dff" />
        </Box>
      ) : (
        <Box p={2}>
          {/* Search and Add Button */}
          <Grid container spacing={2} mb={2} alignItems="center">
            <Grid item xs={12} sm={9}>
              <TextField
                label="Search Category"
                fullWidth
                value={searchTerm}
                onChange={handleSearch}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setOpen(true)}
              >
                Add Category
              </Button>
            </Grid>
          </Grid>

          {/* Table or List View */}
          {isMobile ? (
            <Grid container spacing={2}>
              {category
                .filter((item) =>
                  item.catagoryName.toLowerCase().includes(searchTerm)
                )
                .map((item, index) => (
                  <Grid item xs={12} key={item._id}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6">{item.catagoryName}</Typography>
                      <Box display="flex" justifyContent="space-between" mt={2}>
                        <Switch
                          checked={item.status === "on"}
                          onChange={() => switchToggle(item._id)}
                        />
                        <Button onClick={() => deleteData(item._id)}>
                          <DeleteRoundedIcon color="error" />
                        </Button>
                        <Button
                          onClick={() => {
                            setEid(item._id);
                            formik.setValues(item);
                            setOpen(true);
                          }}
                        >
                          <BorderColorRoundedIcon color="success" />
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
            </Grid>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Index</TableCell>
                  <TableCell>Category Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Delete</TableCell>
                  <TableCell>Update</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {category
                  .filter((item) =>
                    item.catagoryName.toLowerCase().includes(searchTerm)
                  )
                  .map((row, index) => (
                    <TableRow key={row._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.catagoryName}</TableCell>
                      <TableCell>
                        <Switch
                          checked={row.status === "on"}
                          onChange={() => switchToggle(row._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => deleteData(row._id)}>
                          <DeleteRoundedIcon color="error" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            setEid(row._id);
                            formik.setValues(row);
                            setOpen(true);
                          }}
                        >
                          <BorderColorRoundedIcon color="success" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </Box>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{eid ? "Update Category" : "Add Category"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              label="Category Name"
              name="catagoryName"
              fullWidth
              onChange={formik.handleChange}
              value={formik.values.catagoryName}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" type="submit">
              {eid ? "Update" : "Add"}
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </ThemeDash>
  );
};

export default Category;