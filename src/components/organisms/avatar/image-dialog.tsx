import { X } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type ChangeImageDialogProps = React.PropsWithChildren<{
  onSubmit?: (file: File[]) => void;
  isLoading?: boolean;
}>;

const MAX_FILE_SIZE = 1024 * 1024 * 2;
const MAX_FILE = 1;

export default function ChangeImageDialog({ children, onSubmit }: ChangeImageDialogProps) {
  const methods = useForm<{
    file: FileList;
  }>();
  const [open, setOpen] = React.useState(false);
  const { watch } = methods;
  const files = watch("file");

  const handleRemoveFile = (index: number) => {
    const newFiles = Array.from(files);
    newFiles.splice(index, 1);
    const dataTransfer = new DataTransfer();
    newFiles.forEach((file) => dataTransfer.items.add(file));
    methods.setValue("file", dataTransfer.files);
  };

  const validateFile = (file: File) => {
    return file.size <= MAX_FILE_SIZE;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          methods.reset();
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <DialogTitle>Tải ảnh lên</DialogTitle>
        </DialogTitle>
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit((data: { file: FileList }) => {
              if (data.file.length > 0) {
                if (typeof onSubmit === "function") {
                  onSubmit(Array.from(data.file));
                }
              }
              setOpen(false);
              methods.reset();
            })}
          >
            <Input
              type="file"
              multiple={false}
              accept="image/*"
              onChange={(e) => {
                methods.reset();
                const files = e.target.files;
                if (files && files.length > MAX_FILE) {
                  methods.setError("file", {
                    type: "fileCount",
                    message: `Chỉ được chọn tối đa ${MAX_FILE} file`,
                  });
                  return;
                } else {
                  methods.clearErrors("file");
                }
                if (files) {
                  let errors = false;
                  Array.from(files).forEach((file) => {
                    if (!validateFile(file)) {
                      errors = true;
                    }
                  });
                  if (errors) {
                    methods.setError("file", {
                      type: "fileSize",
                      message: `Kích thước file không được vượt quá 2MB`,
                    });
                  } else {
                    methods.clearErrors("file");
                    methods.setValue("file", files);
                  }
                }
              }}
            />
            {methods.formState.errors.file && (
              <div className="text-destructive">{methods.formState.errors.file.message}</div>
            )}
            {files && (
              <div className="mt-4 flex flex-wrap gap-4">
                {Array.from(files).map((file, index) => {
                  if (file.type.startsWith("image/"))
                    return (
                      <div key={index} className="relative w-full sm:w-auto">
                        <img
                          alt=""
                          src={URL.createObjectURL(file)}
                          className="h-auto w-full rounded-full object-cover sm:h-20 sm:w-20"
                        />
                        <Button
                          className="absolute right-0 top-0 size-7 rounded-full p-1"
                          variant="outline"
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X />
                        </Button>
                      </div>
                    );
                })}
              </div>
            )}
            <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-row">
              <DialogClose>
                <Button variant="outline" type="reset" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={Boolean(methods.formState.errors.file)}
                className="w-full sm:w-auto"
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
