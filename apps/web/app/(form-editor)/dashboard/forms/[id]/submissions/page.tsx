import { MoveLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import FormSubmissionList from '~/modules/form/components/form-submission-list';

const Submissions = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (

    <main className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <Button asChild variant="secondary" size="sm" className="bg-transparent text-muted-foreground hover:text-white transition">
          <Link href="/dashboard/forms"><MoveLeftIcon /> Back to forms</Link>
        </Button>
      </div>
      <div className="">
        <div className="mt-2 flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">Submissions</h1>
          <FormSubmissionList formId={id} />
        </div>
      </div>
    </main>
  )
}

export default Submissions
