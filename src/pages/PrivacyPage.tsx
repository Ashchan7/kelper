
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

const PrivacyPage = () => {
  return (
    <motion.div 
      className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-black/5 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">1. Introduction</h2>
              <p>
                At Kelper, we respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you about how we look after your personal data when you visit our website, use our services, and tell you about your privacy rights and how the law protects you.
              </p>
              <p className="mt-2">
                This policy applies to information we collect when you use our website, platform, and services, or when you otherwise interact with us, including when you upload, download, or stream content.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">2. Personal Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier, and profile picture.</li>
                <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li><strong>Usage Data</strong> includes information about how you use our website, products and services, including your viewing history, favorites, and content upload activity.</li>
                <li><strong>Profile Data</strong> includes your username, password, preferences, feedback, and survey responses.</li>
                <li><strong>Content Data</strong> includes information about the content you upload or interact with.</li>
                <li><strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
              </ul>
              <p className="mt-4">
                We do not collect any Special Categories of Personal Data about you (this includes details about your race or ethnicity, religious or philosophical beliefs, sex life, sexual orientation, political opinions, trade union membership, information about your health, and genetic and biometric data). Nor do we collect any information about criminal convictions and offenses.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">3. How We Collect Your Data</h2>
              <p>
                We use different methods to collect data from and about you including through:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Direct interactions.</strong> You may give us your Identity, Contact, and Profile Data by filling in forms, creating an account, uploading content, or by corresponding with us.</li>
                <li><strong>Automated technologies or interactions.</strong> As you interact with our website, we automatically collect Technical Data about your equipment, browsing actions, and patterns. We collect this data by using cookies, server logs, and other similar technologies.</li>
                <li><strong>Third parties or publicly available sources.</strong> We may receive personal data about you from various third parties such as authentication providers (like Google) when you sign in using their services.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">4. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>To register you as a new user and manage your account</li>
                <li>To provide our services and process content uploads</li>
                <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy</li>
                <li>To personalize your experience and deliver relevant content and recommendations</li>
                <li>To administer and protect our business and this website</li>
                <li>To monitor and manage content compliance with our policies</li>
                <li>To use data analytics to improve our website, products/services, marketing, user relationships and experiences</li>
                <li>To respond to your inquiries, comments, and requests</li>
                <li>To enforce our terms, conditions, and policies</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">5. Third-Party Sharing</h2>
              <p>
                We may share your personal data with the following categories of third parties:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Service Providers:</strong> We may share your information with service providers who work on our behalf to help us operate, provide, improve, integrate, customize, support, and market our services.</li>
                <li><strong>Analytics Providers:</strong> We use analytics providers, such as Google Analytics, to help us understand the use of our services.</li>
                <li><strong>Authentication Providers:</strong> If you choose to log in using a third-party authentication provider (like Google), we will receive information from that service.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
              </ul>
              <p className="mt-4">
                We require all third parties to respect the security of your personal data and to treat it in accordance with the law. We do not allow our third-party service providers to use your personal data for their own purposes and only permit them to process your personal data for specified purposes and in accordance with our instructions.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">6. Cookies and Similar Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
              </p>
              <p className="mt-2">
                We use the following types of cookies:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Essential Cookies:</strong> Necessary for the operation of our website.</li>
                <li><strong>Analytical/Performance Cookies:</strong> Allow us to recognize and count the number of visitors and see how visitors move around our website.</li>
                <li><strong>Functionality Cookies:</strong> Used to recognize you when you return to our website.</li>
                <li><strong>Targeting Cookies:</strong> Record your visit to our website, the pages you have visited, and the links you have followed.</li>
              </ul>
              <p className="mt-4">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">7. Data Retention</h2>
              <p>
                We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements.
              </p>
              <p className="mt-2">
                In determining the appropriate retention period for personal data, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure, the purposes for which we process the data, and whether we can achieve those purposes through other means.
              </p>
              <p className="mt-2">
                For user accounts, we will typically retain your personal data for as long as you maintain an active account with us, and for a reasonable period thereafter to handle any follow-up queries or legal requirements.
              </p>
              <p className="mt-2">
                For content you upload, we will retain this for as long as it remains on our platform, and may retain certain metadata related to your uploads even after content is removed to comply with legal obligations.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">8. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. These measures include:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Encryption of sensitive data</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication requirements</li>
                <li>Secure backup procedures</li>
                <li>Staff training on data protection</li>
              </ul>
              <p className="mt-4">
                We have procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">9. Your Legal Rights</h2>
              <p>
                Under certain data protection laws, you have rights in relation to your personal data, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Access:</strong> You can request access to your personal data.</li>
                <li><strong>Correction:</strong> You can request correction of inaccurate personal data.</li>
                <li><strong>Erasure:</strong> You can request deletion of your personal data in certain circumstances.</li>
                <li><strong>Restriction:</strong> You can request restriction of processing of your personal data.</li>
                <li><strong>Data Portability:</strong> You can request transfer of your personal data to you or a third party.</li>
                <li><strong>Objection:</strong> You can object to processing of your personal data in certain circumstances.</li>
                <li><strong>Withdraw Consent:</strong> You can withdraw consent where we rely on consent to process your personal data.</li>
              </ul>
              <p className="mt-4">
                If you wish to exercise any of these rights, please contact us using the details provided in the "Contact Us" section.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">10. International Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than the country in which you reside. These countries may have data protection laws that are different from the laws of your country.
              </p>
              <p className="mt-2">
                Whenever we transfer your personal data to countries outside of your jurisdiction, we ensure a similar degree of protection is afforded to it by implementing appropriate safeguards.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">11. Children's Privacy</h2>
              <p>
                Our service is not intended for use by children under the age of 13, and we do not knowingly collect personal data from children under 13. If we learn that we have collected personal data from a child under 13, we will take steps to delete that information as quickly as possible.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">12. Changes to the Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              <p className="mt-2">
                We will let you know via email and/or a prominent notice on our website, prior to the change becoming effective, and update the "Last Updated" date at the top of this Privacy Policy.
              </p>
              <p className="mt-2">
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>
            
            <section className="pb-6">
              <h2 className="text-xl font-semibold mb-3 text-foreground">13. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact our Data Protection Officer:
              </p>
              <address className="not-italic mt-2">
                Data Protection Officer<br />
                Kelper<br />
                Email: privacy@kelper.com<br />
                Phone: +1 (234) 567-890<br />
                Address: 123 Archive Street, San Francisco, CA 94103
              </address>
            </section>
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
};

export default PrivacyPage;
