
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

const TermsPage = () => {
  return (
    <motion.div 
      className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-black/5 dark:bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">1. Introduction</h2>
              <p>
                Welcome to Kelper. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions. Please review them carefully.
              </p>
              <p className="mt-2">
                Kelper provides a platform for users to upload, stream, and download public domain and Creative Commons-licensed content. Our goal is to facilitate the sharing of legal, properly licensed content while respecting the intellectual property rights of others.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">2. Definitions</h2>
              <p>"Kelper" refers to our website and service platform.</p>
              <p>"User" refers to any individual accessing or using Kelper.</p>
              <p>"Content" refers to any media, information, or data available through or uploaded to Kelper.</p>
              <p>"User-Generated Content" refers to any content uploaded or posted by users of Kelper.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">3. User Responsibilities</h2>
              <p>
                As a user of Kelper, you are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Ensuring that any content you upload is in the public domain or properly licensed under applicable Creative Commons licenses or other permissions that allow sharing and streaming;</li>
                <li>Providing accurate information about the content you upload, including proper attribution to creators;</li>
                <li>Respecting the intellectual property rights of others;</li>
                <li>Complying with all applicable laws and regulations;</li>
                <li>Maintaining the security of your account and password;</li>
                <li>All activities that occur under your account.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">4. Prohibited Content</h2>
              <p>
                The following types of content are prohibited on Kelper:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Content that infringes on the copyright, trademark, or other intellectual property rights of others;</li>
                <li>Content that violates applicable laws or regulations;</li>
                <li>Pornographic, obscene, or sexually explicit material;</li>
                <li>Content that promotes discrimination, hatred, harassment, or harm against any individual or group;</li>
                <li>Content that promotes illegal activities;</li>
                <li>Malware, viruses, or other malicious code;</li>
                <li>Spam, phishing content, or scams;</li>
                <li>Content that impersonates another person or entity;</li>
                <li>Content that violates the privacy or publicity rights of others.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">5. Content Moderation</h2>
              <p>
                Kelper reserves the right, but not the obligation, to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Monitor and review all content uploaded to our platform;</li>
                <li>Remove any content that violates these Terms of Service or is otherwise objectionable;</li>
                <li>Suspend or terminate user accounts that violate these Terms of Service;</li>
                <li>Disclose information about users and content to comply with applicable laws, regulations, legal processes, or governmental requests.</li>
              </ul>
              <p className="mt-2">
                We strive to maintain a platform that respects the rights of all users and third parties. If you believe that content on Kelper violates these Terms of Service, please report it to us immediately.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">6. DMCA Compliance</h2>
              <p>
                Kelper complies with the Digital Millennium Copyright Act (DMCA). If you believe that your content has been used in a way that constitutes copyright infringement, please see our <a href="/dmca" className="text-primary hover:underline">DMCA Policy</a> for information on how to submit a takedown notice.
              </p>
              <p className="mt-2">
                Users who repeatedly infringe copyrights may have their accounts terminated.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">7. User Accounts</h2>
              <p>
                Some features of Kelper may require you to create a user account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <p className="mt-2">
                You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
              </p>
              <p className="mt-2">
                We reserve the right to terminate accounts, remove content, or cancel transactions at our sole discretion.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">8. Intellectual Property</h2>
              <p>
                Kelper respects the intellectual property rights of others and expects its users to do the same. The content available through our platform may be subject to copyright, trademark, and other intellectual property rights owned by us, our users, the Internet Archive, or other third parties.
              </p>
              <p className="mt-2">
                By uploading content to Kelper, you represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>You own or have the necessary rights, licenses, consents, and permissions to use and authorize Kelper to use the content;</li>
                <li>The content does not infringe upon the rights of any third party;</li>
                <li>The content complies with these Terms of Service and all applicable laws and regulations.</li>
              </ul>
              <p className="mt-2">
                You retain ownership of your content, but grant Kelper a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display the content in connection with our services.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">9. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Kelper, its affiliates, officers, directors, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) that arise from:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Your use of Kelper;</li>
                <li>Content you upload or submit to Kelper;</li>
                <li>Your violation of these Terms of Service;</li>
                <li>Your violation of any rights of a third party, including intellectual property rights.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">10. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Kelper shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Your access to or use of or inability to access or use the service;</li>
                <li>Any conduct or content of any third party on the service;</li>
                <li>Any content obtained from the service;</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content;</li>
                <li>The accuracy, reliability, or legality of any content available through the service.</li>
              </ul>
              <p className="mt-2">
                Kelper does not warrant or guarantee the accuracy, completeness, or reliability of any content available through our service, including content sourced from the Internet Archive or uploaded by users.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">11. Disclaimer of Warranties</h2>
              <p>
                Kelper provides the service on an "as is" and "as available" basis, without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
              </p>
              <p className="mt-2">
                Kelper does not warrant that the service will function uninterrupted, secure, or available at any particular time or location, or that any errors or defects will be corrected.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">12. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of these terms and/or by providing other forms of notice. Your continued use of Kelper after such changes constitutes your acceptance of the new terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">13. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
              </p>
            </section>
            
            <section className="pb-6">
              <h2 className="text-xl font-semibold mb-3 text-foreground">14. Contact Information</h2>
              <p>
                For any questions about these Terms of Service, please contact us at:
              </p>
              <address className="not-italic mt-2">
                Email: legal@kelper.com<br />
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

export default TermsPage;
