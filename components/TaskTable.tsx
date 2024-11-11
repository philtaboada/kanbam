'use client'
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from './ui/table'
import { ITask } from '@/lib/types';
import { getTasks } from '@/services/scrumApi';
import { useSearchParams } from 'next/navigation';

const TaskTable = () => {

  const [tasks, setTasks] = useState<ITask[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTasks = async () => {

      const status = searchParams.get('status');
      const assignee = searchParams.get('assignee');

      const Alltasks = await getTasks();
      let filteredTasks = Alltasks;

      if (status) {
        filteredTasks = filteredTasks.filter((task: ITask) => task.status.toLowerCase() === status.toLowerCase());
      };

      if (assignee) {
        filteredTasks = filteredTasks.filter((task: ITask) => task.assignee.toLowerCase() === assignee.toLowerCase());
      };

      setTasks(filteredTasks);
    };
    fetchTasks();
  }, [searchParams]);

  return (
    <Table>
      <TableCaption>A list of all tasks.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Assigned to</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task._id}>
            <TableCell className="font-medium">{task.taskId}</TableCell>
            <TableCell>{task.description}</TableCell>
            <TableCell>{task.assignee}</TableCell>
            <TableCell className="text-right">{task.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total {tasks.length}</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export default TaskTable