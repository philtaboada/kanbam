'use client'
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useRouter } from 'next/navigation';


const FilterTable = () => {
  const router = useRouter();
  const [status, setStatus] = useState('all');
  const [assignee, setAssignee] = useState('all');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const statusParam = params.get('status');
    const assigneeParam = params.get('assignee');

    if (statusParam) setStatus(statusParam);
    if (assigneeParam) setAssignee(assigneeParam);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    if (assignee !== 'all') params.set('assignee', assignee);
    router.push(`/table?${params.toString()}`);
  }, [status, assignee, router]);

  return (
    <div className='flex gap-4 m-4'>
      <Select value={status} onValueChange={(value) => {
        setStatus(value);
      }}>
        <SelectTrigger>
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="not-started">Not started</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="testing">Testing</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>
      <Select value={assignee} onValueChange={(value) => {
        console.log('Assignee changed to:', value);
        setAssignee(value);
      }}>
        <SelectTrigger>
          <SelectValue placeholder="Select an assignee" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Jhon Pillaca">Jhon Pillaca</SelectItem>
          <SelectItem value="Phil Taboada">Phil Taboada</SelectItem>
          <SelectItem value="Kevin Pumaille">Kevin Pumaille</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default FilterTable