import { CustomButton } from "@components/button/button";
import { DashboardLayout } from "@components/layouts/dashboard-layout";
import {
  createFileRoute,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import EventDetails from "@components/pages/vendor/proposal/event-details";
import { TextArea } from "@components/accessories/text-area";
import { InputField } from "@components/accessories/input-field";
import { DropdownInput } from "@components/accessories/dropdown-input";
import { BadgeCheck, FileQuestionMark, PlusIcon, SendIcon } from "lucide-react";
import { useState } from "react";
import Modal from "@components/accessories/main-modal";
import UploadInputField from "@components/accessories/upload-input-field";

export const Route = createFileRoute("/_vendor/vendor/event/$eventId/proposal")({
  component: RouteComponent,
});
function RouteComponent() {
  const [shouldOpenSubmitModal, setShouldOpenSubmitModal] = useState(false);
  const [shouldOpenSubmitSuccessfulModal, setShouldOpenSubmitSuccessfulModal] =
    useState(false);
  const router = useRouter();
  const navigate = useNavigate();
  return (
    <>
      <DashboardLayout isVendor>
        <div className="space-y-8">
          <CustomButton
            onClick={() => router.history.back()}
            title="Go back"
            className="text-sm w-auto px-4 py-3 border opacity-60 bg-transparent text-default"
          />
          <EventDetails />
          <TextArea
            label="Add proposal Description"
            placeholder="Enter proposal description"
            value=""
            className="aspect-video max-h-[500px] bg-[#f7f7f7]"
            onChange={() => {}}
          />
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-8 relative">
              <InputField
                parentClassName="flex-1"
                label="Services & Deliverables Description"
                placeholder="Enter services & deliverables description"
                value=""
                onChange={() => {}}
              />
              <div className="lg:max-w-[300px] md:max-w-[150px] w-full md:w-auto">
                <label className="block text-gray-600 text-sm mb-2 font-medium">
                  Service price
                </label>
                <div className="relative w-full">
                  <InputField
                    parentClassName="w-full"
                    placeholder="0.0"
                    value=""
                    onChange={() => {}}
                    className="text-right pl-16"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <DropdownInput
                      buttonClassName="bg-[#F4F4F4] text-xs py-1 px-2"
                      itemClassName="text-xs px-2 gap-2"
                      options={[
                        {
                          value: "NGN",
                          label: "NGN",
                          //   flag: "🇳🇬",
                        },
                        {
                          value: "USD",
                          label: "USD",
                          //   flag: "🇺🇸",
                        },
                        {
                          value: "EUR",
                          label: "EUR",
                          //   flag: "🇪🇺",
                        },
                      ]}
                      value={{
                        value: "NGN",
                        label: "NGN",
                        // flag: "🇳🇬",
                      }}
                      onChange={() => {}}
                      placeholder="NGN"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-end">
              <button
                title="Add more"
                className="cursor-pointer text-sm text-[#7417C6] inline-flex items-center gap-1"
              >
                <span>Add more</span>
                <span>
                  <PlusIcon className="size-4" />
                </span>
              </button>
            </div>
          </div>

          <UploadInputField
            label="Upload files"
            parentClassName="w-full"
            onChange={(e) => {
              console.log(e.target.files);
            }}
            files={[]}
          />
          <InputField
            label="Add proposal link"
            placeholder="https://www.example.com"
            value=""
            onChange={() => {}}
          />
          <div className="flex items-center gap-6">
            <CustomButton
              title="Cancel"
              onClick={() => router.history.back()}
              className="flex-1 text-xs bg-transparent border border-[##7417C6] text-[#7417C6] hover:bg-[#7417C6]/10"
            />
            <CustomButton
              onClick={() => setShouldOpenSubmitModal(true)}
              title="Send Proposal"
              className="flex-1 text-xs"
              icon={<SendIcon className="size-4" />}
            />
          </div>
        </div>
      </DashboardLayout>
      <Modal
        isOpen={shouldOpenSubmitModal}
        onClose={() => setShouldOpenSubmitModal(false)}
        showCloseButton={false}
      >
        <div className="flex flex-col gap-6 items-center px-6 py-10 text-center">
          <div className="flex flex-col gap-4 items-center">
            <div className="size-20 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500">
              <FileQuestionMark className="size-9" />
            </div>
            <h1 className="text-2xl font-medium">Submit Proposal</h1>
            <p className="text-gray-500 text-sm">
              "You are about to submit your proposal for Tech Innovation Summit
              2025. Once submitted, you will not be able to edit the details
              unless the proposal is withdrawn. Please confirm to proceed."
            </p>
          </div>
          <div className="flex gap-4 flex-row w-full items-center">
            <CustomButton
              title="Go back"
              onClick={() => setShouldOpenSubmitModal(false)}
              className="border-[#7417C6] border text-[#7417C6] hover:bg-[#7417C6]/10 bg-transparent flex-1 text-sm py-3 px-4"
            />
            <CustomButton
              title="Send Proposal"
              icon={<SendIcon className="size-4" />}
              onClick={() => {
                setShouldOpenSubmitSuccessfulModal(true);
                setShouldOpenSubmitModal(false);
              }}
              className="flex-1 py-3 px-4 rounded-xl text-sm"
            />
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={shouldOpenSubmitSuccessfulModal}
        onClose={() => setShouldOpenSubmitSuccessfulModal(false)}
        showCloseButton={false}
      >
        <div className="flex flex-col gap-6 items-center px-6 py-10 text-center">
          <div className="flex flex-col gap-4 items-center">
            <div className="size-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
              <BadgeCheck className="size-9" />
            </div>
            <h1 className="text-2xl font-medium">
              Proposal submitted Successfully
            </h1>
            <p className="text-gray-500 text-sm">
              Your proposal for Tech Innovation Summit 2025 has been sent to the
              event planner. You’ll be notified once it’s reviewed.
            </p>
          </div>
          <div className="flex gap-4 flex-row w-full items-center">
            <CustomButton
              title="Explore Events"
              onClick={() => {
                setShouldOpenSubmitModal(false);
                navigate({ to: "/vendor/event" });
              }}
              className="border-[#7417C6] border text-[#7417C6] hover:bg-[#7417C6]/20 bg-[#7417C6]/10 flex-1 text-sm py-3 px-4"
            />
            <CustomButton
              title="Go to my proposals"
              onClick={() => {
                setShouldOpenSubmitSuccessfulModal(false);
                navigate({ to: "/vendor/proposal" });
              }}
              className="flex-1 py-3 px-4 rounded-xl text-sm bg-green-500 text-white hover:bg-green-600"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
