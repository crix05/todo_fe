'use client';

import * as yup from 'yup';
import { Formik, useFormik } from "formik";
import { TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText } from "@mui/material";
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'editModal.css';
import { useRouter } from 'next/router';


export default function Edit(id: string) {

    const [initialData, setinitialData] = useState<any>();

    useEffect(() => {
        const fetchTasks = async () => {
          try {
            const response = await axios.get('.../{$id}'); 
            setinitialData(response.data); 
          } catch (error) {
            console.error('Error fetching tasks:', error);
          }
        };
    
        fetchTasks();
      }, []);

    const validation = yup.object({
        title: yup
          .string()
          .required('Task name is required'),
        priority: yup
          .string()
          .required('Priority is required'),
        status: yup
        .string()
        .required('Priority is required')
      });

      const router = useRouter();


      const formik = useFormik({
        initialValues: {
          title: initialData.title,
          priority: initialData.priority,
          status: initialData.status
        },
        validationSchema: validation,
        onSubmit: async (values) => {
            console.log('Form submitted:', values);
            try {
              await axios.put(`https://your-api-endpoint.com/tasks/${id}`, values);
            } catch (error) {
              console.error('Error updating task:', error);
            }
            router.push('/');
          },
      });

      return (
        <div className="edit-form-container">
          <h2>Edit Task</h2>
          <form onSubmit={formik.handleSubmit} className="form">
            <TextField
              id="title"
              name="title"
              label="Task Name"
              variant="outlined"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              value={formik.values.title}
              className="textField"
            />
    
            <FormControl
              variant="outlined"
              error={formik.touched.priority && Boolean(formik.errors.priority)}
              className="selectField"
            >
              <InputLabel>Priority</InputLabel>
              <Select
                id="priority"
                name="priority"
                value={formik.values.priority}
                onChange={formik.handleChange}
                label="Priority"
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
              
            </FormControl>
    
            <FormControl
              variant="outlined"
              error={formik.touched.status && Boolean(formik.errors.status)}
              className="selectField"
            >
              <InputLabel>Status</InputLabel>
              <Select
                id="status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                label="Status"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
              
            </FormControl>
    
            <Button type="submit" className="submitButton" variant="contained">
              Save Changes
            </Button>
          </form>
        </div>
      );
}