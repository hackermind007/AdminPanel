import React, { useEffect, useState } from "react";
import ThemeDash from "../Compnents/ThemeDash";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Switch, TableCell, MenuItem, Select, InputLabel, FormControl, CircularProgress } from "@mui/material";
import TextField from "../Compnents/TextField";
import { useFormik } from "formik";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import TableComponent from "../Compnents/TableComponent";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { HashLoader } from "react-spinners";


const SubCategory = () => {
  const token = localStorage.getItem("token");
  const [subcategory, setSubCategory] = useState([]);
  const [filterSubcategory, setfiltersubcategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [eid, setEid] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);  // Loading state

  const TableHeader = [
    "Index",
    "SubCategory Name",
    "Category Name",
    "Status",
    "Delete",
    "Update",
  ];

  const formik = useFormik({
    initialValues: {
      subCatagoryname: "",
      catagoryID: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);  // Start loading
        const url = eid
          ? `https://interviewhub-3ro7.onrender.com/subcatagory/${eid}`
          : "https://interviewhub-3ro7.onrender.com/subcatagory/create";
        const method = eid ? "patch" : "post";

        const res = await axios[method](url, values, {
          headers: { Authorization: token },
        });

        toast.success(res.data.message);
        resetForm();
        setEid(null);
        handleClose();
        dataFetch();
      } catch (error) {
        toast.error("An error occurred.");
        console.error(error);
      } finally {
        setLoading(false);  // Stop loading
      }
    },
  });

  const dataFetch = async () => {
    setLoading(true);  // Start loading
    try {
      const res = await axios.get(
        "https://interviewhub-3ro7.onrender.com/subcatagory/",
        {
          headers: { Authorization: token },
        }
      );
      setSubCategory(res.data.data);
      setfiltersubcategory(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch subcategories.");
      console.error(error);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  const fetchCategories = async () => {
    setLoading(true);  // Start loading
    try {
      const res = await axios.get(
        "https://interviewhub-3ro7.onrender.com/catagory/",
        {
          headers: { Authorization: token },
        }
      );
      setCategories(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories.");
      console.error(error);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = subcategory.filter((sub) =>
      sub.subCatagoryname.toLowerCase().includes(term) ||
      sub.catagoryID?.catagoryName?.toLowerCase().includes(term)
    );
    setfiltersubcategory(filtered);
  };

  const updateData = (id) => {
    const selectedData = subcategory.find((item) => item._id === id);
    setEid(id);
    formik.setValues(selectedData);
    setOpen(true);
  };

  const switchToggle = async (id) => {
    const selectedData = subcategory.find((item) => item._id === id);
    const updatedStatus = selectedData.status === "on" ? "off" : "on";

    // setLoading(true);  // Start loading
    try {
      await axios.patch(
        `https://interviewhub-3ro7.onrender.com/subcatagory/${id}`,
        { status: updatedStatus },
        { headers: { Authorization: token } }
      );
      dataFetch();
    } catch (error) {
      toast.error("Failed to update status.");
      console.error(error);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  const deleteData = async (id) => {
    setLoading(true);  // Start loading
    try {
      const res = await axios.delete(
        `https://interviewhub-3ro7.onrender.com/subcatagory/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      toast.success(res.data.message);
      dataFetch();
    } catch (error) {
      toast.error("Failed to delete subcategory.");
      console.error(error);
    } finally {
      setLoading(false); 
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEid(null);
    formik.resetForm();
  };

  useEffect(() => {
    dataFetch();
    fetchCategories();
  }, []);

  return (
    <ThemeDash>


      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <HashLoader color="#122dff" />
        </Box>
      ) : (
        <Box>
          <Box className="mb-2">
            <React.Fragment>
              <Box className="gap-2 d-flex justify-content-between align-items-center">
                <Box sx={{ width: "85%" }}>
                  <TextField
                    label="Search Sub-Category"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </Box>
                <Box sx={{ width: "15%" }}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpen(true);
                    }}
                    className="w-100 py-3"
                  >
                    ADD SUB CATEGORY
                  </Button>
                </Box>
              </Box>
            </React.Fragment>
          </Box>
          <Box sx={{ width: "100%" }}>
            <TableComponent
              TableHeader={TableHeader}
              TableData={filterSubcategory}
              renderRow={(row, index) => (
                <>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.subCatagoryname}</TableCell>
                  <TableCell>{row.catagoryID?.catagoryName}</TableCell>
                  <TableCell>
                    <Switch
                      checked={row.status === "on"}
                      onClick={() => switchToggle(row._id)}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <Button onClick={() => deleteData(row._id)}>
                      <DeleteRoundedIcon className="text-danger" />
                    </Button>
                  </TableCell>
                  <TableCell align="left">
                    <Button onClick={() => updateData(row._id)}>
                      <BorderColorRoundedIcon className="text-success" />
                    </Button>
                  </TableCell>
                </>
              )}
            />
          </Box>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {eid ? "Update SubCategory" : "Add SubCategory"}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              label="SubCategory Name"
              name="subCatagoryname"
              onChange={formik.handleChange}
              value={formik.values.subCatagoryname}
              fullWidth
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="catagoryID"
                value={formik.values.catagoryID}
                onChange={formik.handleChange}
              >
              
                {categories.map((category) => (
                  category?.status === 'on'?<MenuItem key={category._id} value={category._id}>
                    {category.catagoryName}
                  </MenuItem> : ''
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" type="submit">
              {eid ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ToastContainer />
    </ThemeDash>
  );
};

export default SubCategory;
