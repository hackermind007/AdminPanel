import React, { useEffect, useState } from "react";
import ThemeDash from "../Compnents/ThemeDash";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TextField from "../Compnents/TextField";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import { useFormik } from "formik";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { HashLoader } from "react-spinners";

const SubCategory = () => {
  const token = localStorage.getItem("token");
  const [subcategory, setSubCategory] = useState([]);
  const [filterSubcategory, setfiltersubcategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [eid, setEid] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Mobile view detection

  // Fetch Subcategories
  const dataFetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://interviewhub-3ro7.onrender.com/subcatagory/",
        { headers: { Authorization: token } }
      );
      setSubCategory(res.data.data);
      setfiltersubcategory(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch subcategories.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://interviewhub-3ro7.onrender.com/catagory/",
        { headers: { Authorization: token } }
      );
      setCategories(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories.");
    }
  };

  useEffect(() => {
    dataFetch();
    fetchCategories();
  }, []);

  // Formik for Dialog Form
  const formik = useFormik({
    initialValues: { subCatagoryname: "", catagoryID: "" },
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const url = eid
          ? `https://interviewhub-3ro7.onrender.com/subcatagory/${eid}`
          : "https://interviewhub-3ro7.onrender.com/subcatagory/create";
        const method = eid ? "patch" : "post";
        await axios[method](url, values, { headers: { Authorization: token } });
        toast.success(eid ? "Updated Successfully" : "Added Successfully");
        resetForm();
        handleClose();
        dataFetch();
      } catch (error) {
        toast.error("An error occurred.");
      } finally {
        setLoading(false);
      }
    },
  });

  // Handle Search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = subcategory.filter((sub) =>
      sub.subCatagoryname.toLowerCase().includes(term) ||
      sub.catagoryID?.catagoryName?.toLowerCase().includes(term)
    );
    setfiltersubcategory(filtered);
  };

  // Handle Edit
  const updateData = (id) => {
    const selectedData = subcategory.find((item) => item._id === id);
    setEid(id);
    formik.setValues(selectedData);
    setOpen(true);
  };

  // Handle Status Toggle
  const switchToggle = async (id) => {
    try {
      const selectedData = subcategory.find((item) => item._id === id);
      const updatedStatus = selectedData.status === "on" ? "off" : "on";
      await axios.patch(
        `https://interviewhub-3ro7.onrender.com/subcatagory/${id}`,
        { status: updatedStatus },
        { headers: { Authorization: token } }
      );
      dataFetch();
    } catch {
      toast.error("Failed to update status.");
    }
  };

  // Handle Delete
  const deleteData = async (id) => {
    setLoading(true);
    try {
      await axios.delete(
        `https://interviewhub-3ro7.onrender.com/subcatagory/${id}`,
        { headers: { Authorization: token } }
      );
      toast.success("Deleted successfully.");
      dataFetch();
    } catch {
      toast.error("Failed to delete subcategory.");
    } finally {
      setLoading(false);
    }
  };

  // Close Dialog
  const handleClose = () => {
    setOpen(false);
    setEid(null);
    formik.resetForm();
  };

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
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={9}>
              <TextField
                label="Search Sub-Category"
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
                ADD SUB CATEGORY
              </Button>
            </Grid>
          </Grid>

          {/* Table */}
          <Box mt={2}>
            <Paper sx={{ overflow: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>SubCategory Name</TableCell>
                    <TableCell>Category Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Delete</TableCell>
                    <TableCell>Update</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filterSubcategory.map((row, index) => (
                    <TableRow key={row._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.subCatagoryname}</TableCell>
                      <TableCell>{row.catagoryID?.catagoryName}</TableCell>
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
                        <Button onClick={() => updateData(row._id)}>
                          <BorderColorRoundedIcon color="success" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        </Box>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>{eid ? "Update SubCategory" : "Add SubCategory"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              label="SubCategory Name"
              name="subCatagoryname"
              fullWidth
              onChange={formik.handleChange}
              value={formik.values.subCatagoryname}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="catagoryID"
                value={formik.values.catagoryID}
                onChange={formik.handleChange}
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.catagoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained">
              {eid ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </ThemeDash>
  );
};

export default SubCategory;