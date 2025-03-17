
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
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">2. Definitions</h2>
              <p>"Kelper" refers to our website and service platform.</p>
              <p>"User" refers to any individual accessing or using Kelper.</p>
              <p>"Content" refers to any media, information, or data available through Kelper.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">3. Use of Services</h2>
              <p>
                Kelper provides access to a curated collection of media from the Internet Archive. Users may browse, stream, and bookmark content for personal, non-commercial use only.
              </p>
              <p>
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Use our services for any illegal purpose or in violation of any local, state, national, or international law</li>
                <li>Redistribute, download, or share content in violation of copyright laws</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Impersonate any person or entity or falsely state or misrepresent your affiliation</li>
                <li>Collect or store personal data about other users without their consent</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">4. Intellectual Property</h2>
              <p>
                Kelper is a streaming service that provides access to content from the Internet Archive. The content available through our platform may be subject to copyright, trademark, and other intellectual property rights owned by the Internet Archive or other third parties.
              </p>
              <p>
                Kelper does not claim ownership of the content streamed through our platform. All content rights remain with their original owners.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">5. User Accounts</h2>
              <p>
                Some features of Kelper may require you to create a user account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <p>
                You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">6. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Kelper shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Your access to or use of or inability to access or use the service</li>
                <li>Any conduct or content of any third party on the service</li>
                <li>Any content obtained from the service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">7. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of these terms and/or by providing other forms of notice. Your continued use of Kelper after such changes constitutes your acceptance of the new terms.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">8. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
              </p>
            </section>
            
            <section className="pb-6">
              <h2 className="text-xl font-semibold mb-3 text-foreground">9. Contact Information</h2>
              <p>
                For any questions about these Terms of Service, please contact us at:
              </p>
              <address className="not-italic mt-2">
                Email: contact@kelper.com<br />
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
