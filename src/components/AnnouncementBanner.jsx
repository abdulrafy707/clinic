import Link from 'next/link'

export const AnnouncementBanner = () => {
  return (
    <div className="bg-indigo-600 py-2 text-center text-sm text-white">
      <p className="flex items-center justify-center gap-2">
        💜 We&apos;re teaming up with Not One More Vet to bring better wellness to the veterinary community.
        <Link href="#" className="underline hover:text-indigo-200">
          Learn More →
        </Link>
      </p>
    </div>
  )
}
