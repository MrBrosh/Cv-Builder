import { motion } from 'framer-motion'
import { ThemeSelector, TemplateSelector, PersonalInfoForm, SummarySection, ExperienceSection, EducationSection, SkillsSection, JobSectorsSection } from '../components/editor'
import { Loader } from '../components/ui'
import { useCV } from '../context/CVContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export function EditorPage() {
  const { isLoading } = useCV()

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader variant="spinner" className="h-8 w-8 text-primary-400" />
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6 pb-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <TemplateSelector />
      </motion.div>
      <motion.div variants={itemVariants}>
        <ThemeSelector />
      </motion.div>
      <motion.div variants={itemVariants}>
        <PersonalInfoForm />
      </motion.div>
      <motion.div variants={itemVariants}>
        <SummarySection />
      </motion.div>
      <motion.div variants={itemVariants}>
        <ExperienceSection />
      </motion.div>
      <motion.div variants={itemVariants}>
        <EducationSection />
      </motion.div>
      <motion.div variants={itemVariants}>
        <SkillsSection />
      </motion.div>
      <motion.div variants={itemVariants}>
        <JobSectorsSection />
      </motion.div>
    </motion.div>
  )
}
