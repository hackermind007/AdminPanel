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

const QA = () => {
    const token = localStorage.getItem("token");
    const [subcategory, setSubCategory] = useState([]);
    const [filterqa, setfilterqa] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [qa, setqa] = useState([]);
    const [eid, setEid] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);  // Loading state

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
        initialValues: {
            questions: '',
            answer: '',
            subcatagoryID: ''
        },
        onSubmit: async (values, { resetForm }) => {
            try {
                setLoading(true);  // Start loading
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
                console.error(error);
            } finally {
                setLoading(false);  // End loading
            }
        },
    });

    const dataFetch = async () => {
        try {
            setLoading(true);  // Start loading
            const res = await axios.get(
                "https://interviewhub-3ro7.onrender.com/questions/",
                {
                    headers: { Authorization: token },
                }
            );
            setSubCategory(res.data.data);
            setfilterqa(res.data.data);
        } catch (error) {
            toast.error("Failed to fetch subcategories.");
            // console.error(error);
        } finally {
            setLoading(false);  // End loading
        }
    };

    const fetchSubCategories = async () => {
        try {
            setLoading(true);  // Start loading
            const res = await axios.get(
                "https://interviewhub-3ro7.onrender.com/subcatagory/",
                {
                    headers: { Authorization: token },
                }
            );
            setqa(res.data.data);
        } catch (error) {
            toast.error("Failed to fetch categories.");
            // console.error(error);
        } finally {
            setLoading(false);  // End loading
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
            setLoading(true);  // Start loading
            const res = await axios.delete(
                `https://interviewhub-3ro7.onrender.com/questions/${id}`,
                {
                    headers: { Authorization: token },
                }
            );
            toast.success(res.data.message);
            dataFetch();
        } catch (error) {
            toast.error("Failed to delete Question.");
            // console.error(error);
        } finally {
            setLoading(false);  // End loading
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
            <Box sx={{ width: "100%" }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: '100%', height: '100vh'}}>
                        <HashLoader color="#122dff" />
                    </Box>
                ) : (
                    <Box>
                        <Box className="mb-2">
                            <React.Fragment>
                                <Box className='gap-2 d-flex justify-content-between align-items-center'>
                                    <Box sx={{ width: '85%' }}>
                                        <TextField label='Search Question' value={searchTerm} onChange={handleSearch} />
                                    </Box>
                                    <Box sx={{ width: '15%' }}>
                                        <Button variant="contained" onClick={() => { setOpen(true) }} className="w-100 py-3">
                                            ADD Q & A
                                        </Button>
                                    </Box>
                                </Box>
                            </React.Fragment>
                        </Box>
                        <TableComponent
                            TableHeader={TableHeader}
                            TableData={filterqa}
                            renderRow={(row, index) => (
                                <>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.questions}</TableCell>
                                    <TableCell>{row.answer}</TableCell>
                                    <TableCell>{row.subcatagoryID?.subCatagoryname}</TableCell>
                                    <TableCell>{row.subcatagoryID?.catagoryID.catagoryName}</TableCell>
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
                )}
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {eid ? "Update SubCategory" : "Add SubCategory"}
                </DialogTitle>
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <TextField
                            label="Question"
                            name="questions"
                            onChange={formik.handleChange}
                            value={formik.values.questions}
                            fullWidth
                        />
                        <TextField
                            label="Answer"
                            name="answer"
                            onChange={formik.handleChange}
                            value={formik.values.answer}
                            fullWidth
                        />
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Sub Category</InputLabel>
                            <Select
                                name="subcatagoryID"
                                value={formik.values.subcatagoryID}
                                onChange={formik.handleChange}
                            >
                                {qa.map((subcategory) => (
                                   subcategory?.status === 'on' ? <MenuItem key={subcategory._id} value={subcategory._id}>
                                        {subcategory.subCatagoryname}
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

export default QA;
