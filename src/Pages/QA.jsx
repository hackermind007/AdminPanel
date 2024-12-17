import React, { useEffect, useState } from "react";
import ThemeDash from "../Compnents/ThemeDash";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableCell,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Paper,
  Grid,
  TableContainer,
} from "@mui/material";
import TextField from "../Compnents/TextField";
import { useFormik } from "formik";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import TableComponent from "../Compnents/TableComponent";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import { HashLoader } from "react-spinners";

const QA = () => {
  const token = localStorage.getItem("token");
  const [subcategory, setSubCategory] = useState([]);
  const [filterqa, setfilterqa] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [qa, setqa] = useState([]);
  const [eid, setEid] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const TableHeader = [
    "No",
    "Questions",
    "Answer",
    "SubCategory",
    "Category",
    "Delete",
    "Update",
  ];

  const formik = useFormik({
    initialValues: { questions: "", answer: "", subcatagoryID: "" },
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const url = eid
          ? `https://interviewhub-3ro7.onrender.com/questions/${eid}`
          : "https://interviewhub-3ro7.onrender.com/questions/create";
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
      } finally {
        setLoading(false);
      }
    },
  });

  const dataFetch = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://interviewhub-3ro7.onrender.com/questions/",
        { headers: { Authorization: token } }
      );
      setSubCategory(res.data.data);
      setfilterqa(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://interviewhub-3ro7.onrender.com/subcatagory/",
        { headers: { Authorization: token } }
      );
      setqa(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch subcategories.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = subcategory.filter((sub) =>
      sub.questions.toLowerCase().includes(term)
    );
    setfilterqa(filtered);
  };

  const updateData = (id) => {
    const selectedData = subcategory.find((item) => item._id === id);
    setEid(id);
    formik.setValues(selectedData);
    setOpen(true);
  };

  const deleteData = async (id) => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `https://interviewhub-3ro7.onrender.com/questions/${id}`,
        { headers: { Authorization: token } }
      );
      toast.success(res.data.message);
      dataFetch();
    } catch (error) {
      toast.error("Failed to delete Question.");
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
    fetchSubCategories();
  }, []);

  return (
    <ThemeDash>
      <Box sx={{ width: "100%", overflowX: "hidden", px: { xs: 1, sm: 2 } }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ height: "80vh" }}
          >
            <HashLoader color="#122dff" />
          </Box>
        ) : (
          <Box>
            {/* Search and Button Section */}
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={12} sm={8}>
                <TextField
                  label="Search Question"
                  value={searchTerm}
                  onChange={handleSearch}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  onClick={() => setOpen(true)}
                  fullWidth
                >
                  ADD Q & A
                </Button>
              </Grid>
            </Grid>

            {/* Table Section */}
            <TableContainer
              component={Paper}
              sx={{
                width: "100%",
                overflowX: "auto",
                boxShadow: 3,
                borderRadius: "8px",
              }}
            >
              <TableComponent
                TableHeader={TableHeader}
                TableData={filterqa}
                renderRow={(row, index) => (
                  <>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.questions}</TableCell>
                    <TableCell>{row.answer}</TableCell>
                    <TableCell>{row.subcatagoryID?.subCatagoryname}</TableCell>
                    <TableCell>
                      {row.subcatagoryID?.catagoryID?.catagoryName}
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
                  </>
                )}
              />
            </TableContainer>
          </Box>
        )}
      </Box>

      {/* Dialog Section */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{eid ? "Update Q & A" : "Add Q & A"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              label="Question"
              name="questions"
              onChange={formik.handleChange}
              value={formik.values.questions}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Answer"
              name="answer"
              onChange={formik.handleChange}
              value={formik.values.answer}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Sub Category</InputLabel>
              <Select
                name="subcatagoryID"
                value={formik.values.subcatagoryID}
                onChange={formik.handleChange}
              >
                {qa.map((subcategory) =>
                  subcategory?.status === "on" ? (
                    <MenuItem key={subcategory._id} value={subcategory._id}>
                      {subcategory.subCatagoryname}
                    </MenuItem>
                  ) : null
                )}
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
      <ToastContainer />
    </ThemeDash>
  );
};

export default QA;