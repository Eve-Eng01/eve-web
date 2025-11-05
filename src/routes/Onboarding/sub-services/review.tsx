import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CustomButton } from "@components/button/button";
import logo from "@assets/evaLogo.png";
import bottom from "@assets/onBoarding/bottom.png";
import { Edit, Trash2, ChevronRight, Plus, Check, X } from "lucide-react";
import { useState } from "react";
import Modal from "@components/accessories/main-modal";
import { UploadFormComponent } from "@components/accessories/upload-form-component";

export const Route = createFileRoute("/onboarding/sub-services/review")({
  component: RouteComponent,
});

interface ProfileData {
  fullName: string;
  email: string;
  companyName: string;
  businessType: string;
  location: string;
  vendorNumber: string;
  availability: string;
  hourlyRate: string;
  portfolioItems: Array<{
    id: number;
    title: string;
    images: number;
    size: string;
  }>;
  socialLinks: Array<{
    id: number;
    platform: string;
    url: string;
  }>;
}

function RouteComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleContinue = () => {
    navigate({ to: "/status/success" });
  };

  // State for profile data
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "Emumwen Gabriel Osauonamen",
    email: "gabrielemumwen20@gmail.com",
    companyName: "Eve Even Platform",
    businessType: "Catering",
    location: "ibeju Lekki Lagos, Nigeria.",
    vendorNumber: "+234-081- 5882-5489",
    availability: "40hrs a week",
    hourlyRate: "10,000 / hr",
    portfolioItems: [
      {
        id: 1,
        title: "Wedding Setup at Lekki Gardens",
        images: 6,
        size: "19.3MB",
      },
      {
        id: 2,
        title: "Wedding Setup at Lekki Gardens",
        images: 6,
        size: "19.3MB",
      },
      {
        id: 3,
        title: "Wedding Setup at Lekki Gardens",
        images: 6,
        size: "19.3MB",
      },
    ],
    socialLinks: [
      {
        id: 1,
        platform: "Instagram",
        url: "https://example.com/yourportfolio",
      },
      {
        id: 2,
        platform: "Instagram",
        url: "https://example.com/yourportfolio",
      },
    ],
  });

  // State to track which fields are being edited
  const [editingFields, setEditingFields] = useState<{
    [key: string]: boolean;
  }>({});

  // State to store temporary values during editing
  const [tempValues, setTempValues] = useState<{ [key: string]: string }>({});

  // Function to start editing a field
  const startEditing = (fieldName: string) => {
    setEditingFields((prev) => ({ ...prev, [fieldName]: true }));
    setTempValues((prev) => ({
      ...prev,
      [fieldName]: profileData[fieldName as keyof ProfileData] as string,
    }));
  };

  // Function to save changes
  const saveField = (fieldName: string) => {
    setProfileData((prev) => ({
      ...prev,
      [fieldName]: tempValues[fieldName],
    }));
    setEditingFields((prev) => ({ ...prev, [fieldName]: false }));
    setTempValues((prev) => {
      const newTemp = { ...prev };
      delete newTemp[fieldName];
      return newTemp;
    });
  };

  // Function to cancel editing
  const cancelEditing = (fieldName: string) => {
    setEditingFields((prev) => ({ ...prev, [fieldName]: false }));
    setTempValues((prev) => {
      const newTemp = { ...prev };
      delete newTemp[fieldName];
      return newTemp;
    });
  };

  // Function to handle input changes
  const handleInputChange = (fieldName: string, value: string) => {
    setTempValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleFormSubmit = (formData: {
    title: string;
    description: string;
    externalLink: string;
    images: File[];
  }) => {
    const { title, description, externalLink, images } = formData;
    if (images.length === 0) return; // Do not add if no images

    // Calculate total size in MB and format as string
    const totalSizeInMB = (
      images.reduce((acc, file) => acc + file.size, 0) /
      (1024 * 1024)
    ).toFixed(2);
    const thumbnail = URL.createObjectURL(images[0]); // Use first image for thumbnail
  };

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="min-h-screen flex bg-white justify-center items-center">
          <div className="flex flex-col justify-center items-center px-4">
            <div className="mx-auto mb-4">
              <img src={logo} alt="" className="w-[60px] h-[60px]" />
            </div>
            <h2 className="text-black header">Review Your Information</h2>
            <p className="text-black para">
              Here's a summary of everything you've added. Make sure your
              details are correct before submitting your profile.
            </p>

            {/* review */}
            <div className="w-full max-w-2xl mx-auto px-4 h-[432px] overflow-y-auto bg-white">
              <div className="space-y-6">
                {/* Profile Information */}
                <div className="bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-gray-600">✱</div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Profile Information
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Full Name
                      </label>
                      <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                        {editingFields.fullName ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={tempValues.fullName || ""}
                              onChange={(e) =>
                                handleInputChange("fullName", e.target.value)
                              }
                              className="flex-1 bg-white border rounded px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              autoFocus
                            />
                            <div className="flex gap-1">
                              <Check
                                className="w-4 h-4 text-green-600 cursor-pointer hover:text-green-700"
                                onClick={() => saveField("fullName")}
                              />
                              <X
                                className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-700"
                                onClick={() => cancelEditing("fullName")}
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="text-gray-900">
                              {profileData.fullName}
                            </span>
                            <Edit
                              className="w-4 h-4 text-purple-600 cursor-pointer hover:text-purple-700"
                              onClick={() => startEditing("fullName")}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                        {editingFields.email ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="email"
                              value={tempValues.email || ""}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className="flex-1 bg-white border rounded px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              autoFocus
                            />
                            <div className="flex gap-1">
                              <Check
                                className="w-4 h-4 text-green-600 cursor-pointer hover:text-green-700"
                                onClick={() => saveField("email")}
                              />
                              <X
                                className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-700"
                                onClick={() => cancelEditing("email")}
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="text-gray-900">
                              {profileData.email}
                            </span>
                            <Edit
                              className="w-4 h-4 text-purple-600 cursor-pointer hover:text-purple-700"
                              onClick={() => startEditing("email")}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    {/* Company and Business Type */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Company name
                        </label>
                        <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                          {editingFields.companyName ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="text"
                                value={tempValues.companyName || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "companyName",
                                    e.target.value
                                  )
                                }
                                className="flex-1 bg-white border rounded px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                autoFocus
                              />
                              <div className="flex gap-1">
                                <Check
                                  className="w-4 h-4 text-green-600 cursor-pointer hover:text-green-700"
                                  onClick={() => saveField("companyName")}
                                />
                                <X
                                  className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-700"
                                  onClick={() => cancelEditing("companyName")}
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <span className="text-gray-900">
                                {profileData.companyName}
                              </span>
                              <Edit
                                className="w-4 h-4 text-purple-600 cursor-pointer hover:text-purple-700"
                                onClick={() => startEditing("companyName")}
                              />
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Business Type
                        </label>
                        <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                          {editingFields.businessType ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="text"
                                value={tempValues.businessType || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "businessType",
                                    e.target.value
                                  )
                                }
                                className="flex-1 bg-white border rounded px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                autoFocus
                              />
                              <div className="flex gap-1">
                                <Check
                                  className="w-4 h-4 text-green-600 cursor-pointer hover:text-green-700"
                                  onClick={() => saveField("businessType")}
                                />
                                <X
                                  className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-700"
                                  onClick={() => cancelEditing("businessType")}
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <span className="text-gray-900">
                                {profileData.businessType}
                              </span>
                              <Edit
                                className="w-4 h-4 text-purple-600 cursor-pointer hover:text-purple-700"
                                onClick={() => startEditing("businessType")}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Location and Vendor Number */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Location
                        </label>
                        <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                          {editingFields.location ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="text"
                                value={tempValues.location || ""}
                                onChange={(e) =>
                                  handleInputChange("location", e.target.value)
                                }
                                className="flex-1 bg-white border rounded px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                autoFocus
                              />
                              <div className="flex gap-1">
                                <Check
                                  className="w-4 h-4 text-green-600 cursor-pointer hover:text-green-700"
                                  onClick={() => saveField("location")}
                                />
                                <X
                                  className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-700"
                                  onClick={() => cancelEditing("location")}
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <span className="text-gray-900">
                                {profileData.location}
                              </span>
                              <Edit
                                className="w-4 h-4 text-purple-600 cursor-pointer hover:text-purple-700"
                                onClick={() => startEditing("location")}
                              />
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Vendors Number
                        </label>
                        <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                          {editingFields.vendorNumber ? (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="text"
                                value={tempValues.vendorNumber || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "vendorNumber",
                                    e.target.value
                                  )
                                }
                                className="flex-1 bg-white border rounded px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                autoFocus
                              />
                              <div className="flex gap-1">
                                <Check
                                  className="w-4 h-4 text-green-600 cursor-pointer hover:text-green-700"
                                  onClick={() => saveField("vendorNumber")}
                                />
                                <X
                                  className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-700"
                                  onClick={() => cancelEditing("vendorNumber")}
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <span className="text-gray-900">
                                {profileData.vendorNumber}
                              </span>
                              <Edit
                                className="w-4 h-4 text-purple-600 cursor-pointer hover:text-purple-700"
                                onClick={() => startEditing("vendorNumber")}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="bg-white">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Your Availability
                  </h3>
                  <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
                    {editingFields.availability ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={tempValues.availability || ""}
                          onChange={(e) =>
                            handleInputChange("availability", e.target.value)
                          }
                          className="flex-1 bg-white border rounded px-2 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          autoFocus
                        />
                        <div className="flex gap-1">
                          <Check
                            className="w-4 h-4 text-green-600 cursor-pointer hover:text-green-700"
                            onClick={() => saveField("availability")}
                          />
                          <X
                            className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-700"
                            onClick={() => cancelEditing("availability")}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="text-gray-900">
                          {profileData.availability}
                        </span>
                        <Edit
                          className="w-4 h-4 text-purple-600 cursor-pointer hover:text-purple-700"
                          onClick={() => startEditing("availability")}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* My Portfolio */}
                <div className="bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="text-gray-600">✱</div>
                      <h3 className="text-lg font-medium text-gray-900">
                        My Portfolio
                      </h3>
                    </div>
                    <div
                      className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {profileData.portfolioItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <div className="w-8 h-8 bg-blue-400 rounded"></div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              You've uploaded {item.images} image • {item.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer" />
                          <ChevronRight className="w-4 h-4 text-gray-400 cursor-pointer" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="text-gray-600">✱</div>
                      <h3 className="text-lg font-medium text-gray-900">
                        How you charge for your services
                      </h3>
                    </div>
                    <Edit
                      className="w-4 h-4 text-purple-600 cursor-pointer hover:text-purple-700"
                      onClick={() => startEditing("hourlyRate")}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Hourly Rate
                        </h4>
                        <p className="text-sm text-gray-600">
                          Charge clients based on time spent working.
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-2 border-purple-600 rounded-lg">
                      {editingFields.hourlyRate ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={tempValues.hourlyRate || ""}
                            onChange={(e) =>
                              handleInputChange("hourlyRate", e.target.value)
                            }
                            className="w-20 bg-white border rounded px-2 py-1 text-purple-600 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                            autoFocus
                          />
                          <div className="flex gap-1">
                            <Check
                              className="w-4 h-4 text-green-600 cursor-pointer hover:text-green-700"
                              onClick={() => saveField("hourlyRate")}
                            />
                            <X
                              className="w-4 h-4 text-red-600 cursor-pointer hover:text-red-700"
                              onClick={() => cancelEditing("hourlyRate")}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-purple-600 font-medium">
                          {profileData.hourlyRate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="text-gray-600">✱</div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Portfolio/Social Media links
                      </h3>
                    </div>
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {profileData.socialLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded"></div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {link.platform}
                            </h4>
                            <p className="text-sm text-gray-600">{link.url}</p>
                          </div>
                        </div>
                        <Trash2 className="w-4 h-4 text-gray-400 cursor-pointer" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md otherbtn mt-[40px]">
              <CustomButton title="Continue" onClick={handleContinue} />
            </div>
          </div>
        </div>

        <div className="overflow-hidden pointer-events-none">
          <div className="relative">
            <img src={bottom} alt="" className="w-full img" />
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Your Image"
        size="lg"
        animationDuration={400}
        className="max-w-2xl"
      >
        <UploadFormComponent onSubmit={handleFormSubmit} />
      </Modal>
    </>
  );
}
