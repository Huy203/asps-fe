import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface FocusTimerAlertProps {
  isShown: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
export function FocusTimerAlert(props: FocusTimerAlertProps) {
  const { isShown, onConfirm, onCancel } = props;
  return (
    <div {...(isShown ? {} : { inert: "true" })}>
      <AlertDialog open={isShown}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to exit? </AlertDialogTitle>
            <AlertDialogDescription>
              This action will reset the timer and you will lose the progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
