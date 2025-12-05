import InformationCard from "@components/accessories/information-card";
import { CustomButton } from "@components/button/button";
import { DashboardLayout } from "@components/layouts/dashboard-layout";
import ImageList from "@components/pages/vendor/proposal/image-list";
import VideoList from "@components/pages/vendor/proposal/video-list";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import eventImage from "@assets/event/event-image.png";
import { cn } from "@utils/classnames";
import { useState } from "react";
import Modal from "@components/accessories/main-modal";
import { FileQuestionMark } from "lucide-react";

export const Route = createFileRoute("/_vendor/vendor/proposal/$proposalId")({
  component: RouteComponent,
});

const ACTIVE_TAB_CLASSNAME = "border-[#7417C6] text-[#7417C6] opacity-100",
  BUTTON_CLASSNAME =
    "bg-transparent border hover:bg-[#7417C6]/10 hover:opacity-100 hover:border-[#7417C6]/40 text-xs !py-2 !px-4 !mt-0 !mb-0 rounded-xl",
  UNACTIVE_TAB_CLASSNAME = "opacity-60 text-default bg-white",
  EVENT_DATA_CLASSNAME = "justify-between";

function RouteComponent() {
  const [shouldOpenWithdrawModal, setShouldOpenWithdrawModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
  const { proposalId } = Route.useParams();
  const router = useRouter();
  console.log(proposalId);
  return (
    <>
      <DashboardLayout isVendor>
        <div className="space-y-8">
          <CustomButton
            onClick={() => router.history.back()}
            title="Go back"
            className="text-sm w-auto px-4 py-3 border opacity-60 bg-transparent text-default"
          />
          <div className="bg-[#f4f4f4] p-2 rounded-md space-y-4">
            <div className="w-full aspect-video max-h-[570px] relative bg-black/10">
              <img
                src={eventImage}
                alt="Event"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <h1 className="text-xl font-medium">Tech Innovation Summit 2025</h1>
            <InformationCard
              className={EVENT_DATA_CLASSNAME}
              title="Event"
              value="Music & Arts Festival"
            />
            <InformationCard
              className={EVENT_DATA_CLASSNAME}
              title="Proposal ID"
              value="PRP-001"
            />
            <InformationCard
              className={EVENT_DATA_CLASSNAME}
              title="Location"
              value="Lagos, Nigeria"
            />
            <InformationCard
              className={EVENT_DATA_CLASSNAME}
              title="Status"
              rightContent={<span className="text-orange-500">● Pending</span>}
            />

            <InformationCard
              className={EVENT_DATA_CLASSNAME}
              title="Submitted on"
              value="October 25, 2025"
            />
            <InformationCard
              className={EVENT_DATA_CLASSNAME}
              title="Amount Submitted"
              value="$25,000,500"
            />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-medium">Proposal Description</h1>
            <div className="bg-[#F4F4F4] rounded-lg p-4 space-y-2 border border-dashed border-black/10">
              <p className="text-gray-500">
                “We specialize in organizing high-profile corporate events and
                have a proven track record of managing technology summits,
                product launches, and large-scale conferences for over 10 years.
                Our team of experienced planners, designers, and coordinators
                will work closely with your organization to ensure that the Tech
                Innovation Summit 2025 exceeds expectations. From the earliest
                planning phases, we prioritize clear communication, efficient
                budgeting, and creative solutions tailored to your brand’s
                vision. Our approach is end-to-end, meaning we handle every
                stage of the process. We will develop a comprehensive event plan
                that includes scheduling, vendor coordination, and contingency
                strategies to guarantee a seamless experience. Our design team
                will create a modern, professional atmosphere with stage setups,
                lighting, and branding elements that reflect the innovative
                nature of the summit. Catering services will offer diverse,
                high-quality menu options to accommodate the dietary needs of
                all 300 expected guests, ensuring a memorable dining experience.
                Technical support is another core area where we excel. We will
                provide advanced audio-visual equipment, reliable live-streaming
                solutions for remote participants, and on-site technical staff
                to ensure that presentations run flawlessly. After the event,
                our team will oversee the complete wrap-up process, including
                venue restoration, financial reporting, and collection of
                attendee feedback to provide you with actionable insights. By
                combining creativity with logistical precision, we are confident
                that our proposal offers the highest value and will help
                position the Tech Innovation Summit as a standout event in
                2025.”
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-medium">
              Price services & deliverables
            </h1>
            <div className="bg-[#F4F4F4] rounded-lg p-4 space-y-4 border border-dashed border-black/10">
              <InformationCard
                title="Catering (buffet for 500 guests, includes 3 meals + coffee breaks):"
                value="₦4,200,000"
              />
              <InformationCard
                title="Audio-Visual Setup (sound, stage lighting, projector screens, technical staff):"
                value="₦2,500,000"
              />
              <InformationCard
                title="On-Site Support Staff (10 assistants for 2 days):"
                value="₦800,000"
              />
              <InformationCard
                title="Total Proposal Amount:"
                value="₦7,500,000"
              />
            </div>
          </div>
          <div className="flex flex-col items-start gap-3">
            <h1 className="text-2xl font-medium">Files</h1>
            <div className="bg-[#F4F4F4] rounded-lg p-1 space-y-2 gap-2 flex flex-row items-center">
              <CustomButton
                title="Photos"
                onClick={() => setActiveTab("images")}
                className={cn(
                  BUTTON_CLASSNAME,
                  activeTab === "images" && ACTIVE_TAB_CLASSNAME,
                  activeTab !== "images" && UNACTIVE_TAB_CLASSNAME
                )}
              />
              <CustomButton
                title="Videos"
                onClick={() => setActiveTab("videos")}
                className={cn(
                  BUTTON_CLASSNAME,
                  activeTab === "videos" && ACTIVE_TAB_CLASSNAME,
                  activeTab !== "videos" && UNACTIVE_TAB_CLASSNAME
                )}
              />
            </div>
            {activeTab === "images" && (
              <ImageList
                images={[
                  "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
                  "https://images.unsplash.com/photo-1518770660439-4636190af475",
                  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
                  "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
                  "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
                  "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
                ]}
              />
            )}
            {activeTab === "videos" && (
              <VideoList
                videos={[
                  {
                    video:
                      "https://player.vimeo.com/external/336304705.sd.mp4?s=8e47a1a61b3b74636f56dc427d19851473944e7e&profile_id=164",
                    thumbnail:
                      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
                  },
                  {
                    video:
                      "https://player.vimeo.com/external/304197849.sd.mp4?s=11f872c8d2d0a2beb7657ed844cc7b8ce8e75a87&profile_id=165",
                    thumbnail:
                      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
                  },
                  {
                    video:
                      "https://player.vimeo.com/external/328686151.sd.mp4?s=620c58c07c9a6f6e9eb1f9fca15d2a88a040a87b&profile_id=164",
                    thumbnail:
                      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
                  },
                  {
                    video:
                      "https://player.vimeo.com/external/341285967.sd.mp4?s=c26f1648aad3fa21c2e10634c1a2514f3de70baf&profile_id=165",
                    thumbnail:
                      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800",
                  },
                  {
                    video:
                      "https://player.vimeo.com/external/319353337.sd.mp4?s=1390e2b6e49ab4e1d2cf34440000b6c79b41e816&profile_id=164",
                    thumbnail:
                      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
                  },
                ]}
              />
            )}
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-medium">Portfolio Link</h1>
            <div className="bg-[#F4F4F4] rounded-lg p-4 space-y-2 border border-dashed border-black/10">
              <p className="text-primary">
                https://eliteeventsco.com/events/tech-leaders-2024
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <CustomButton
              title="Message Planner"
              className="flex-1 text-xs bg-transparent border border-[##7417C6] text-[#7417C6] hover:bg-[#7417C6]/10"
            />
            <CustomButton
              onClick={() => setShouldOpenWithdrawModal(true)}
              title="Withdraw Proposal"
              className="flex-1 text-xs"
            />
          </div>
        </div>
      </DashboardLayout>
      <Modal
        isOpen={shouldOpenWithdrawModal}
        onClose={() => setShouldOpenWithdrawModal(false)}
        showCloseButton={false}
      >
        <div className="flex flex-col gap-6 items-center px-6 py-10 text-center">
          <div className="flex flex-col gap-4 items-center">
            <div className="size-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
              <FileQuestionMark className="size-9" />
            </div>
            <h1 className="text-2xl font-medium">Withdraw Proposal</h1>
            <p className="text-gray-500 text-sm">
              Are you sure you want to withdraw this proposal? Once withdrawn,
              the event planner will no longer be able to review it, and you
              won’t be able to resubmit for this event.
            </p>
          </div>
          <div className="flex gap-4 flex-row w-full items-center">
            <CustomButton
              title="Go back"
              onClick={() => setShouldOpenWithdrawModal(false)}
              className="border-[#7417C6] border text-[#7417C6] hover:bg-[#7417C6]/10 bg-transparent flex-1 text-sm py-3 px-4"
            />
            <CustomButton
              title="Withdraw"
              onClick={() => {}}
              className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white text-sm"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
