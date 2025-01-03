'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Loader2, Edit, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    id: null,
    name: '',
    categories: '',
    adminId: '',
  });
  const [error, setError] = useState(null);

  const getDoctorId = () => localStorage.getItem('userId');

  const fetchTemplates = async () => {
    const doctorId = getDoctorId();
    if (!doctorId) {
      setError('Doctor ID not found in local storage.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/templates?doctorId=${doctorId}`);
      const data = await response.json();

      if (response.ok) {
        setTemplates(data.templates || []);
        setFilteredData(data.templates || []);
      } else {
        setError(data.error || 'Failed to fetch templates.');
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Error fetching templates.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    setFilteredData(
      templates.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      )
    );
  }, [filter, templates]);

  const handleAddNewTemplate = async () => {
    if (!newTemplate.name || !newTemplate.categories || !newTemplate.adminId) {
      alert('All fields are required');
      return;
    }
  
    const parsedAdminId = parseInt(newTemplate.adminId, 10);
    if (isNaN(parsedAdminId)) {
      alert('Invalid admin ID');
      return;
    }
  
    setIsLoading(true);
    try {
      const cleanedCategories = newTemplate.categories
        .split(',')
        .map((category) => category.trim().replace(/^['"]+|['"]+$/g, ''));
  
      const response = newTemplate.id
        ? await fetch(`/api/templates/${newTemplate.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: newTemplate.name,
              categories: cleanedCategories,
              doctorId: parsedAdminId,
            }),
          })
        : await fetch('/api/templates', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: newTemplate.name,
              categories: cleanedCategories,
              doctorId: parsedAdminId,
            }),
          });
  
      if (response.ok) {
        fetchTemplates();
        setIsModalOpen(false);
        setNewTemplate({
          id: null,
          name: '',
          categories: '',
          adminId: '',
        });
      } else {
        const errorData = await response.json();
        console.error('Failed to create/update template:', errorData.message);
      }
    } catch (error) {
      console.error('Error adding/updating template:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteTemplate = async (id) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchTemplates();
      } else {
        console.error('Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTemplate = (template) => {
    const categoriesArray = Array.isArray(template.categories)
      ? template.categories
      : JSON.parse(template.categories);

    setNewTemplate({
      id: template.id,
      name: template.name,
      categories: categoriesArray.join(', '),
      adminId: template.doctorId,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-300">Objective Templates</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => {
                    setNewTemplate({
                      id: null,
                      name: '',
                      categories: '',
                      adminId: getDoctorId(),
                    });
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-blue-800 dark:text-blue-300">{newTemplate.id ? 'Edit Template' : 'Add New Template'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right text-gray-600 dark:text-gray-400">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="objectives" className="text-right text-gray-600 dark:text-gray-400">
                      Objectives
                    </Label>
                    <Input
                      id="objectives"
                      value={newTemplate.categories}
                      onChange={(e) => setNewTemplate({ ...newTemplate, categories: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={handleAddNewTemplate} className="bg-blue-500 hover:bg-blue-600 text-white">
                  {newTemplate.id ? 'Update' : 'Add'}
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isSearchVisible && (
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
          )}
          <div className="rounded-md border border-gray-200 dark:border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-900">
                  <TableHead className="w-[100px] text-gray-600 dark:text-gray-400">ID</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Name</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Objectives</TableHead>
                  <TableHead className="text-right text-gray-600 dark:text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((template) => (
                  <TableRow key={template.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell className="font-medium text-gray-900 dark:text-gray-100">{template.id}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">{template.name}</TableCell>
                    <TableCell className="text-gray-700 dark:text-gray-300">
                      {Array.isArray(template.categories)
                        ? template.categories.join(', ')
                        : JSON.parse(template.categories).join(', ')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTemplate(template)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
    </div>
  );
}