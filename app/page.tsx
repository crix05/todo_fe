'use client'
import Task from './components/task/page';
import * as yup from 'yup';
import { Formik, useFormik } from "formik";
import { TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText } from "@mui/material";
import Button from '@mui/material/Button';
import './styles.css'; 
import { useState, useEffect } from 'react';
import axios from 'axios';
import Edit from './components/editModal/page';
import { useRouter } from 'next/router';

export default function Home() {

  interface Task {
    _id: string;
    title: string;
    priority: string;
    status: string;
  }


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


  const formik = useFormik({
    initialValues: {
      title: '',
      priority: 'High',
      status: 'Pending'
    },
    validationSchema: validation,
    onSubmit: async (values) => {
      console.log(values);
    },
  });


  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(''); 
        setTasks(response.data); 
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);


  // const taskData = {
  //   _id: '12345',
  //   title: 'Learn TypeScript',
  //   priority: 'Medium',
  //   status: 'In Progress'
  // };

  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };




  const handleDelete = (id: string) => {
    console.log('Deleting task');
    const updatedTasks = tasks.filter(task => task._id !== id); 
    setTasks(updatedTasks);

    axios.delete(`https://your-api-endpoint.com/tasks/${id}`)
      .then(response => {
        console.log('Task deleted:', response.data);
      })
      .catch(error => {
        console.error('Error deleting task:', error);
      });
};



  return (
    <div className="container">
      <h1 className="header">Task Management</h1>

      <form onSubmit={formik.handleSubmit} className="form">

        <TextField
          id="title"
          name="title"
          label="Task Name"
          variant="outlined"
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
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
          <FormHelperText>
            {formik.touched.priority && formik.errors.priority}
          </FormHelperText>
        </FormControl>

        <Button type="submit" className="submitButton" variant="contained">Submit</Button>
      </form>




      <div className="task-container">
        {/* <Task
          data={taskData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        /> */}

        {tasks.map((task, index) => (
          <Task
            key={index} // Assuming task data has a unique identifier or index
            data={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

      </div>
    </div>
  );
}
