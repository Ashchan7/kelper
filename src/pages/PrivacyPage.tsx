
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
                At Kelper, we respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">2. The Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li><strong>Usage Data</strong> includes information about how you use our website, products and services, including your viewing history and favorites.</li>
                <li><strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">3. How We Collect Your Data</h2>
              <p>
                We use different methods to collect data from and about you including through:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong>Direct interactions.</strong> You may give us your Identity and Contact Data by filling in forms or by corresponding with us by post, phone, email or otherwise.</li>
                <li><strong>Automated technologies or interactions.</strong> As you interact with our website, we will automatically collect Technical Data about your equipment, browsing actions and patterns.</li>
                <li><strong>Third parties or publicly available sources.</strong> We may receive personal data about you from various third parties and public sources.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">4. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>To register you as a new user</li>
                <li>To provide and improve our services</li>
                <li>To manage our relationship with you</li>
                <li>To personalize your experience</li>
                <li>To administer and protect our business and this website</li>
                <li>To deliver relevant website content and advertisements to you</li>
                <li>To use data analytics to improve our website, products/services, marketing, customer relationships and experiences</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">5. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">6. Data Retention</h2>
              <p>
                We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">7. Your Legal Rights</h2>
              <p>
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">8. Cookies</h2>
              <p>
                Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">9. Changes to the Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>
              <p>
                We will let you know via email and/or a prominent notice on our website, prior to the change becoming effective and update the "last updated" date at the top of this Privacy Policy.
              </p>
            </section>
            
            <section className="pb-6">
              <h2 className="text-xl font-semibold mb-3 text-foreground">10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <address className="not-italic mt-2">
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
