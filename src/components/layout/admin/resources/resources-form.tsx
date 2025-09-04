"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// File validation schema
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "video/avi",
  "video/mov"
]

// Sample courses data - replace with your actual data
const courses = [
  { id: "1", name: "Introduction to React", tag: "REACT-101" },
  { id: "2", name: "Advanced JavaScript", tag: "JS-ADV" },
  { id: "3", name: "Node.js Fundamentals", tag: "NODE-101" },
  { id: "4", name: "Database Design", tag: "DB-201" },
  { id: "5", name: "Web Security", tag: "SEC-101" },
]

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters.",
  }),
  courseId: z.string().min(1, {
    message: "Please select a course.",
  }),
  description: z.string().optional(),
  file: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, "File is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Maximum file size is 10MB.`
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only PDF, DOC, DOCX, TXT, JPG, PNG, GIF, MP4, AVI, and MOV files are accepted."
    )
    .transform((files) => files[0]) // Transform FileList to File
});

const ResourcesForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      courseId: "",
      description: "",
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted with data:", data)
    console.log("File details:", {
      name: data.file.name,
      size: data.file.size,
      type: data.file.type,
    })
    
    // Find the selected course
    const selectedCourse = courses.find(course => course.tag === data.courseId)
    console.log("Selected course:", selectedCourse)
    
    // Here you can handle the form submission
    // Example: Create FormData for file upload
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('courseTag', data.courseId) // Using course tag
    if (data.description) {
      formData.append('description', data.description)
    }
    formData.append('file', data.file)
    
    // Send to your API endpoint
    // fetch('/api/resources', {
    //   method: 'POST',
    //   body: formData,
    // })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Upload Course Resource</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resource Title</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter resource title" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Give your resource a descriptive title.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.tag}>
                        {course.name} ({course.tag})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the course this resource belongs to.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter resource description"
                    className="resize-none"
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Provide additional details about this resource.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Upload File</FormLabel>
                <FormControl>
                  <Input
                    {...fieldProps}
                    value={undefined}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
                    onChange={(e) => {
                      const files = e.target.files
                      onChange(files)
                    }}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </FormControl>
                <FormDescription>
                  Upload files up to 10MB. Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, MP4, AVI, MOV.
                </FormDescription>
                <FormMessage />
                
                {/* Display selected file info */}
                {form.watch('file') && form.watch('file') && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Selected file:</span> {form.watch('file')?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Size:</span> {formatFileSize(form.watch('file')?.size || 0)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Type:</span> {form.watch('file')?.type}
                    </p>
                  </div>
                )}
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit" className="flex-1">
              Upload Resource
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => form.reset()}
              className="flex-1"
            >
              Reset Form
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ResourcesForm;