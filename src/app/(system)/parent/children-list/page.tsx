// @/app/parent/children-list/page.tsx
import { ChildCard } from "./_components/child-card";
import { AddChildCard } from "./_components/add-child-card";
import { db } from "@/lib/db";

const ChildrenListPage = async () => {
  // Mock data for children
  const children = [
    {
      id: "1",
      fullName: "John Doe",
      class: { name: "Class A" },
      attendance: [{ status: "ON_TIME" }],
      faceImageFront: "https://example.com/image1.jpg",
    },
    {
      id: "2",
      fullName: "Jane Smith",
      class: { name: "Class B" },
      attendance: [{ status: "LATE" }],
      faceImageFront: "https://example.com/image2.jpg",
    },
    {
      id: "3",
      fullName: "Sam Johnson",
      class: { name: "Class C" },
      attendance: [{ status: "ABSENT" }],
      faceImageFront: "https://example.com/image3.jpg",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Children List</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children.map((child) => (
          <ChildCard
            key={child.id}
            id={child.id}
            name={child.fullName}
            class={child.class?.name ?? "Unknown"}
            isPresent={
              child.attendance[0]?.status === "ON_TIME" ||
              child.attendance[0]?.status === "LATE"
            }
            imageUrl={child.faceImageFront}
          />
        ))}
        <AddChildCard />
      </div>
    </div>
  );
};

export default ChildrenListPage;
